'use strict';
/* Auth front-end for static hosting; relies on a separately configured Supabase project.
 * This file contains NO private provider credentials and does not access mailbox data.
 */
(() => {
  const page = document.body.dataset.authPage;
  if (!['login', 'account'].includes(page)) return;
  const config = window.ESTATEIQ_AUTH_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test((config.supabaseUrl || '').trim()) &&
    typeof config.supabaseAnonKey === 'string' && config.supabaseAnonKey.length > 20;
  const viableOrigin = /^https?:$/.test(location.protocol);
  const supportedProviders = { google: 'Google', apple: 'Apple', azure: 'Microsoft' };
  const $ = id => document.getElementById(id);
  const statusEl = page === 'login' ? $('authStatus') : $('accountStatus');
  const callbackUrl = new URL('auth.html', location.href).href;
  const accountUrl = new URL('account.html', location.href).href;
  let client = null;
  let createMode = false;
  let pendingFactorId = null;

  function show(message, type='info') {
    statusEl.textContent = message;
    statusEl.className = 'auth-status show' + (type === 'info' ? '' : ' ' + type);
  }
  function initClient() {
    if (!configured || !viableOrigin || !window.supabase?.createClient) return null;
    return window.supabase.createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim(), {
      auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
    });
  }
  function showSetupWarning() {
    if (!configured) show('Preview mode: sign-in is designed but not connected. Configure your own Supabase project to activate Google, Apple, Microsoft and email login. You can explore the fictional dashboard without an account.', 'warning');
    else if (!viableOrigin) show('Live sign-in requires a published HTTPS website or local HTTP development server; file:// previews cannot authenticate.', 'warning');
    else show('Authentication library did not load. Check your internet connection or script restrictions, then reload.', 'error');
  }
  function lock(node, value) { if (node) node.disabled = Boolean(value); }
  async function session() {
    const {data,error} = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  async function signOut() {
    if (!client) return showSetupWarning();
    const {error} = await client.auth.signOut();
    if (error) return show(error.message,'error');
    location.assign(new URL('auth.html',location.href).href);
  }
  const useScopes = provider => provider === 'azure' ? {scopes:'email'} : {};
  async function beginOAuth(provider, linking=false) {
    if (!Object.hasOwn(supportedProviders, provider)) return;
    if (!client) return showSetupWarning();
    const selector = linking ? `[data-link-provider="${provider}"]` : `[data-provider="${provider}"]`;
    const button = document.querySelector(selector);
    lock(button,true);
    show(`Opening ${supportedProviders[provider]} secure sign-in…`);
    const options = {redirectTo: linking ? accountUrl : callbackUrl, ...useScopes(provider)};
    try {
      if (linking) {
        const current = await session();
        if (!current) { location.assign(callbackUrl); return; }
        const {error}=await client.auth.linkIdentity({provider,options});
        if(error) throw error;
      } else {
        const {error}=await client.auth.signInWithOAuth({provider,options});
        if(error) throw error;
      }
    } catch(err) { show(`Unable to continue with ${supportedProviders[provider]}: ${err.message || 'Unknown error'}`,'error'); }
    finally { lock(button,false); }
  }
  function setAuthMode(create) {
    createMode=Boolean(create);
    $('tabSignIn').classList.toggle('active',!createMode);
    $('tabCreate').classList.toggle('active',createMode);
    $('tabSignIn').setAttribute('aria-selected',String(!createMode));
    $('tabCreate').setAttribute('aria-selected',String(createMode));
    $('emailSubmit').firstChild.textContent=createMode?'Create account with email ':'Continue with email ';
    $('authTitle').textContent=createMode?'Make your next move.':'Welcome to EstateIQ.';
    $('authEmail').focus();
  }
  async function emailSubmit(e) {
    e.preventDefault();
    if (!client) return showSetupWarning();
    const email = $('authEmail').value.trim();
    if (!email || !$('authEmail').checkValidity()) {show('Enter a valid email address.','error');return;}
    lock($('emailSubmit'),true);
    try {
      const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:createMode,emailRedirectTo:callbackUrl}});
      if(error) throw error;
      show('Check your email for the one-time sign-in link. If the address is eligible, a message will arrive shortly.','success');
    } catch(err) {show(err.message || 'Email sign-in could not be started.','error');}
    finally {lock($('emailSubmit'),false);}
  }
  async function initLogin() {
    $('tabSignIn').addEventListener('click',()=>setAuthMode(false));
    $('tabCreate').addEventListener('click',()=>setAuthMode(true));
    $('emailAuthForm').addEventListener('submit',emailSubmit);
    document.querySelectorAll('[data-provider]').forEach(b=>b.addEventListener('click',()=>beginOAuth(b.dataset.provider)));
    $('signOutHere').addEventListener('click',signOut);
    if (new URL(location.href).searchParams.get('mode') === 'signup') setAuthMode(true);
    if (!client) {showSetupWarning();return;}
    try {
      const current=await session();
      if(current) {
        $('authFormWrap').hidden=true;
        $('signedInPanel').hidden=false;
        $('signedInEmail').textContent=current.user.email || 'authenticated user';
        show('You are authenticated. Your product workspace is not yet connected to the demo dashboard.','success');
      } else if (location.hash.includes('error=')) {
        show('Your sign-in was not completed. Please try again.','error');
      }
    } catch(err) { show(err.message || 'Could not verify your current session.','error'); }
  }
  function make(tag, text, cls) {
    const el=document.createElement(tag);
    if(text !== undefined) el.textContent=String(text);
    if(cls) el.className=cls;
    return el;
  }
  async function identityView(user) {
    const list=$('identityList'); list.replaceChildren();
    const identities=user.identities || [];
    const providers={email:'Email magic link',google:'Google',apple:'Apple',azure:'Microsoft'};
    if(!identities.length) list.append(make('p','No connected identities returned.','field-help'));
    identities.forEach(id=>{
      const row=make('div',undefined,'identity-row');
      row.append(make('strong',providers[id.provider] || id.provider));
      row.append(make('small','Connected ✓'));
      list.append(row);
    });
    document.querySelectorAll('[data-link-provider]').forEach(b=>{
      const linked=identities.some(id=>id.provider===b.dataset.linkProvider);
      b.disabled=linked;
      b.textContent=linked?`${supportedProviders[b.dataset.linkProvider]} already linked ✓`:`+ Link ${supportedProviders[b.dataset.linkProvider]} sign-in`;
    });
  }
  function mfaButton(text, cb) {
    const b=make('button',text,'mfa-action'); b.type='button'; b.addEventListener('click',cb);return b;
  }
  function mfaInput(labelText) {
    const form=make('form'); form.className='mfa-form';
    const label=make('label',labelText);label.htmlFor='totpCode';
    const input=make('input'); input.id='totpCode';input.inputMode='numeric';input.pattern='[0-9]{6}';input.maxLength=6;input.autocomplete='one-time-code';input.required=true;input.placeholder='6-digit code';
    form.append(label,input); return {form,input};
  }
  async function verifyFactor(factorId,code) {
    const {error}=await client.auth.mfa.challengeAndVerify({factorId,code});
    if(error) throw error;
    show('Two-factor authentication verified.','success');
    await refreshAccount();
  }
  async function showMfaChallenge(factorId) {
    const box=$('mfaUI'); box.replaceChildren();
    box.append(make('p','Enter the current code from your authenticator app to continue.','account-copy'));
    const {form,input}=mfaInput('Authenticator code');
    const submit=make('button','Verify and continue','mfa-action');submit.type='submit';form.append(submit);
    form.addEventListener('submit',async e=>{e.preventDefault();lock(submit,true);try{await verifyFactor(factorId,input.value.trim());}catch(err){show(err.message || 'Invalid code.','error');}finally{lock(submit,false);}});
    box.append(form);$('mfaBadge').textContent='VERIFY REQUIRED';
  }
  async function enrollMfa() {
    const box=$('mfaUI');box.replaceChildren();
    try {
      const {data,error}=await client.auth.mfa.enroll({factorType:'totp',friendlyName:'EstateIQ authenticator'});
      if(error) throw error;
      pendingFactorId=data.id;
      box.append(make('p','Scan this code using your authenticator app, then verify a current 6-digit code.','account-copy'));
      if(data.totp?.qr_code) {
        const img=make('img');img.src=data.totp.qr_code;img.alt='Authenticator enrollment QR code';img.className='qr-code';box.append(img);
      }
      box.append(make('p','Manual setup key (keep private):','field-help'));
      box.append(make('code',data.totp?.secret || 'Unavailable','mfa-secret'));
      const {form,input}=mfaInput('Verify setup code');
      const submit=make('button','Enable two-factor authentication','mfa-action');submit.type='submit';form.append(submit);
      form.addEventListener('submit',async e=>{e.preventDefault();lock(submit,true);try{await verifyFactor(pendingFactorId,input.value.trim());pendingFactorId=null;}catch(err){show(err.message || 'Could not verify code.','error');}finally{lock(submit,false);}});
      box.append(form);$('mfaBadge').textContent='SETUP IN PROGRESS';
    } catch(err){show(err.message || 'Could not begin authenticator setup.','error');await refreshAccount();}
  }
  async function mfaView() {
    const {data,error}=await client.auth.mfa.listFactors();
    if(error) throw error;
    const verified=(data.totp || []).filter(f=>f.status==='verified');
    const box=$('mfaUI');box.replaceChildren();
    const {data:levels,error:levelErr}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if(levelErr) throw levelErr;
    if(verified.length && levels.currentLevel!=='aal2') {
      // Do not display authenticated profile/identity controls before step-up verification.
      document.querySelectorAll('.account-card').forEach(card=>{ if(!card.querySelector('#mfaTitle')) card.hidden=true; });
      await showMfaChallenge(verified[0].id);
      return;
    }
    document.querySelectorAll('.account-card').forEach(card=>card.hidden=false);
    if(verified.length){$('mfaBadge').textContent='ENABLED';box.append(make('p',`${verified.length} verified authenticator factor(s). Keep your recovery access secure.`,'account-copy'));}
    else {$('mfaBadge').textContent='NOT ENABLED';box.append(make('p','Add an authenticator app to secure your sign-in.','account-copy'));box.append(mfaButton('Set up authenticator app →',enrollMfa));}
  }
  async function refreshAccount() {
    const current=await session();
    if(!current){location.replace(callbackUrl);return;}
    const userResult=await client.auth.getUser();
    if(userResult.error) throw userResult.error;
    const user=userResult.data.user;
    $('accountEmail').textContent=user.email || 'No verified email returned';
    $('accountId').textContent=user.id;
    await mfaView();
    const {data}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if(data.currentLevel === 'aal2' || data.nextLevel === 'aal1') await identityView(user);
  }
  async function initAccount() {
    $('accountSignOut').addEventListener('click',signOut);
    document.querySelectorAll('[data-link-provider]').forEach(b=>b.addEventListener('click',()=>beginOAuth(b.dataset.linkProvider,true)));
    if(!client){showSetupWarning();$('accountEmail').textContent='Not connected';$('accountId').textContent='Configure Supabase to activate account settings';$('mfaUI').textContent='Authenticator setup is available after real sign-in.';return;}
    try {await refreshAccount();}
    catch(err) { show(err.message || 'Account details could not be loaded.','error'); }
  }
  client=initClient();
  if(page==='login') initLogin(); else initAccount();
})();
