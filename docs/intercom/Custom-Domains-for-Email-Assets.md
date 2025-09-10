# Custom Domains for Email Assets

Your hosting provider
The below guide provides examples for Cloudflare and AWS as hosting providers as a starting point. If you use a different hosting provider and require assistance, please reach out to us at the Messenger in the bottom right.

When you set up your workspace, all email assets (i.e. images, links, unsubscribe links, attachments) in your emails are served from a subdomain of `intercom-mail.com`, e.g. `your-workspace-name.intercom-mail.com`. We recommend using your own domain to improve the deliverability of your emails and make them more trustworthy.

If you'd like to use your own domain, you can do so by setting up a **custom domain** for email assets using the following steps:

## Create a custom CNAME record

- Go to your DNS providerâ€™s website (e.g. [GoDaddy](https://ie.godaddy.com/help/add-a-cname-record-19236) or **[Cloudflare](https://www.cloudflare.com/dns/)**). If youâ€™re choosing one for the first time, go with one that supports SSL.
- Create a CNAME (â€˜canonical nameâ€™) record for your custom domain.
- Point it at Intercomâ€™s host domain (This is based on your data hosting region, not where you are located geographically):
  - Intercom US: **your-workspace-name.intercom-mail.com**
  - Intercom Europe: **your-workspace-name.intercom-mail.eu**
  - Intercom Australia: **your-workspace-name.au.intercom-mail.com**

Host Domain URL
You can copy the exact Intercom host domain URL of your workspace from the [Link Branding Settings](https://app.intercom.com/a/apps/_/settings/email-custom-assets-domains) page.

### Example: How to create a custom CNAME record with Cloudflare

Using Cloudflare
Some features are only available as part of CloudFlare's Enterprise plan. You will not be able to complete the setup if you do not have access to this plan. See Cloudflare's [Enterprise plan page](https://www.cloudflare.com/plans/enterprise/) for more information.

These steps will vary, so check with your own DNS provider for support. As an example, hereâ€™s how to set up a CNAME record with Cloudflare:

1. Go to the â€˜DNSâ€™ section for your domain in Cloudflare and add a CNAME record for your email assets custom domain.
2. Give the CNAME a **Name** based on the first part of your custom domain e.g. if you want your custom custom domain to be **emails.example.com**, use **emails**.
3. Point it at the Intercom host domain. Depending on your data hosting region, it will look like one of these:

- Intercom US: **your-workspace.intercom-mail.com**
- Intercom Europe: **your-workspace.intercom-mail.eu**
- Intercom Australia: **your-workspace.au.intercom-mail.com**

1. The proxy status should be turned on.

![](/assets/2a15989-screenshot_2023-04-14_at_11.53.22.8e5c1988a4034318e8c1b8110835e67f3df23bc63f1a5f83af7d106b59103828.71a4f21c.png)

DNS changes can sometimes take up to 72 hours to take effect, but are typically much faster.

## Configure SSL

After you set up a custom domain, you must also add SSL support to your domain.

SSL (or TLS), is the most widely used way to secure the connection between your server and your browser. It ensures the connection between the server and browser is encrypted and safe, and appears as HTTPS.

There are two ways to set up SSL with a custom domain for email assets:

- Use a flexible SSL (using a third-party DNS provider like CloudFlare or AWS CloudFront)
- Use your own SSL certificate (using a TLS Termination Proxy)

### Example: How to Configure SSL with Cloudflare

Using Cloudflare
[Rewriting host headers](https://developers.cloudflare.com/support/page-rules/using-page-rules-to-rewrite-host-headers/) is only available as part of CloudFlare's Enterprise plan. You will not be able to take the following steps if you do not have access to this plan. See Cloudflare's [Enterprise plan page](https://www.cloudflare.com/plans/enterprise/) for more information.

#### Add SSL support to your domain

Go to the â€˜SSL/TLSâ€™ section and change SSL to â€˜Fullâ€™.

![](/assets/e7cc047-screenshot_2023-04-14_at_11.42.45.3637f43a256f19c8178554e4b6e3451945617f17e4500613cd41c44aa8b27a3f.71a4f21c.png)

#### Create a page rule to enforce HTTPS

Go to â€˜Rules -> Page Rulesâ€™ and create a new page rule with the following settings:

- If the URL matches: `http://emails.example.com/*`, replacing it with your own custom domain
- Then the settings are: `Always use HTTPS`

Watch out for typos! The protocol in the URL should be **HTTP** not HTTPS.

![](/assets/7162539-screenshot_2023-04-14_at_11.55.11.b0f3abbc17cb27dc18ad65564e8f00d1c818a2acd9d0db4ae70e4321c3e19443.71a4f21c.png)

#### Create a page rule to override the host header

Go to â€˜Rules -> Page Rulesâ€™ again and create a new page rule with the following settings:

- If the URL matches:- `https://emails.example.com/*`
- Then the settings are: `Host Header Override`
- Value: Intercom host URL e.g. `your-workspace.intercom-mail.com`

Watch out for typos! The protocol in the URL should be **HTTP** not HTTPS.

![](/assets/b75f71d-screenshot_2023-04-14_at_11.58.39.830cde40fb6651f69220a9a87fd9960f54342f0afcd97366f243aca74b2ee8e7.71a4f21c.png)

#### Disable Cloudflare page speed features

Go to â€˜Speed -> Optimizationâ€™ and disable Rocket Loader and Mirage for your email assets custom domain.

![](/assets/f091834-screenshot_2023-04-14_at_12.01.29.ce223c10ee12517f15da22365a667ee8399f6fd9b1e7bebc38be317428e6b46c.71a4f21c.png)

### Example: How to configure SSL with AWS

#### Create a CloudFront Distribution

1. Sign in to the AWS Management Console and open the CloudFront console.
2. Choose **Create Distribution**
3. Update the 'Origin' settings.

- Origin domain: Intercom host domain, e.g. `your-workspace.intercom-mail.com`
- Protocol: `HTTPS only`.
- Minimum origin SSL protocol: `TLSv1.2`.

![](/assets/87a9469-us-east-1.console.aws.amazon.com_cloudfront_v3_home_regionus-east-1_2.2a85a9599d90c162a88269f53102c9879c01c2210e0d3a4dd4c779e01545f8bf.71a4f21c.png)

1. Update the 'Default cache behavior' settings.

![](/assets/bde0d94-screenshot_2023-04-14_at_12.18.01.51fb7b45585c16780d5b007da2148eb14981a54c781bc84a8230194c21fb21bd.71a4f21c.png)

1. Update 'Cache key and origin requests':

- Cache policy and origin request policy
- Cache policy: `CachingDisabled`
- Origin request policy: `AllViewerExceptHostHeader`

![](/assets/7d8650a-screenshot_2023-04-14_at_12.18.08.ddc9e5a9f90d38bc3114728e0dc40c110f5e26ef23dcc1b0154eb4846ec00b0c.71a4f21c.png)

1. Under origin 'Settings'

- 'Alternate domain name (CNAME)': your subdomain to be used for assets, e.g. `emails.example.com`
- You must associate a certificate. You need a certificate that matches your domain.

![](/assets/b5621a1-us-east-1.console.aws.amazon.com_cloudfront_v3_home_regionus-east-1_5.3802a8a42ae75436b8973615cf72ea84ae686e3350a078aebc71d483941f9a15.71a4f21c.png)

#### Create a CNAME record

1. Copy your distribution domain name
2. Navigate to your domain provider and create a new CNAME record
3. For host/name input your subdomain (ex. `emails`)
4. For value input your CloudFront distribution domain name

![](/assets/ed2a1db-5.392163e3af2626aace2e0e96e52cb0f97ea7822750b6af569608557c993457c7.71a4f21c.png)

### How to Use your own SSL certificate with Apache

The SSL certificate used by your email assets is a shared certificate signed by your DNS provider. It uses SNI (Server Name Indication) to secure your site.

If you wish to host your own security certificates, you can do so through a [TLS termination proxy](https://en.wikipedia.org/wiki/TLS_termination_proxy). Youâ€™ll need to edit the configuration file on your proxy webserver.

Here are the basic instructions to set up your own SSL using Apache webserver:

```html
# Prerequisites: mod_ssl, mod_proxy and mod_proxy_http should be enabled # Step
1: Acquire an SSL certificate and private key (e.g. LetsEncrypt.org) # Step 2:
Set up Apache proxy settings, example below. # Step 3: Set custom domain in
Intercom Help Center settings # Step 4: Make sure your custom domain's DNS
record resolves to your Apache server

<IfModule mod_ssl.c>
  <VirtualHost *:443>
    ServerName your-help-site.custom-domain.com # specify your custom domain
    here # Set SSL options for your own domain SSLEngine on SSLCertificateFile
    /path/to/your/fullchain.pem SSLCertificateKeyFile
    /path/to/your/privatekey.pem # Proxy SSL options SSLProxyEngine on
    SSLProxyVerifyDepth 10 SSLProxyCheckPeerCN off SSLProxyCheckPeerName on #
    Set up the reverse proxy to Intercom ProxyPreserveHost Off ProxyAddHeaders
    Off ProxyPass / https://your-workspace.intercom-mail.com/ ProxyPassReverse /
    https://your-workspace.intercom-mail.com/
  </VirtualHost>
</IfModule>
```

There are many ways to set up your own SSL certificate - we canâ€™t guarantee that we can support every type of proxy setup. If you have specific needs, we can't support you in configuring it.

Note that you may also need to add redirect from HTTP protocol (port 80) to HTTPS as part of your server configuration.

While most modern browsers support SNI, a few older ones donâ€™t. If youâ€™re supporting those browsers, you should use your own SSL certificate instead. Check with your DNS provider to see if this option is available.

## Enter the newly registered custom domain in Intercom Link branding

The last remaining step is specifying your custom domain in Intercom's Link branding page ([US](https://app.intercom.com/a/apps/_/settings/email-custom-assets-domains), [EU](https://app.eu.intercom.com/a/apps/_/settings/email-custom-assets-domains) and [AU](https://app.au.intercom.com/a/apps/_/settings/email-custom-assets-domains) links).
