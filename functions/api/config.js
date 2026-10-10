// Returns only the public sitekey; never exposes the Turnstile secret.
export async function onRequestGet({env}){
  const hasSiteKey=typeof env?.TURNSTILE_SITE_KEY==='string'&&env.TURNSTILE_SITE_KEY.length>0;
  const hasSecret=typeof env?.TURNSTILE_SECRET_KEY==='string'&&env.TURNSTILE_SECRET_KEY.length>0;
  const hasDb=!!env?.AI_RATE_DB&&typeof env.AI_RATE_DB.prepare==='function';
  const hasSalt=typeof env?.AI_RATE_SALT==='string'&&env.AI_RATE_SALT.length>=24;
  return Response.json({rateLimitEnabled:hasDb&&hasSalt,rateLimitMisconfigured:hasDb!==hasSalt,
    turnstileEnabled:hasSiteKey&&hasSecret,
    misconfigured:hasSiteKey!==hasSecret,
    sitekey:hasSiteKey&&hasSecret?env.TURNSTILE_SITE_KEY:null
  },{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
