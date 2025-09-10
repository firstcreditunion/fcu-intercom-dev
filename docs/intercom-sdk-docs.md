
### Install Intercom in your React application

Choose to install the messenger on a site or app for users who log in. Or install it on a site or landing page that doesn’t identify visitors.

#### For users with logins

Recommended

Install the messenger for logged-in users. The messenger will show info like customer names and previous conversations across devices.

#### For website visitors without logins

Install the messenger for anonymous website visitors who aren’t logged in. Conversations will be saved in the browser via a cookie.

Enable the Messenger API to continue installation

If you’ve already installed the Messenger and later disable the API, it won’t appear on your website or accept any API connections. The API is disabled by default to protect your workspace – make sure to secure the Messenger after installation with [identity verification](https://app.intercom.com/a/apps/a30t2fvp/settings/channels/messenger/security)

Add Intercom to your project using the following snippet:

npm install @intercom/messenger-js-sdk

```
1
```
```
npm install @intercom/messenger-js-sdk
```

To initialize Intercom, copy and paste this code snippet on every page or in a common component where you want the messenger to appear.

This must be done in your client-side code.

import React from 'react'; import Intercom from '@intercom/messenger-js-sdk'; export default function Component() { Intercom({ app\_id: 'a30t2fvp', user\_id: user.id, // IMPORTANT: Replace "user.id" with the variable you use to capture the user's ID name: user.name, // IMPORTANT: Replace "user.name" with the variable you use to capture the user's name email: user.email, // IMPORTANT: Replace "user.email" with the variable you use to capture the user's email created\_at: user.createdAt, // IMPORTANT: Replace "user.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200 }); return <div>Example App</div>; }

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
```
```
import React from 'react';
import Intercom from '@intercom/messenger-js-sdk';

export default function Component() {
  Intercom({
    app_id: 'a30t2fvp',
    user_id: user.id, // IMPORTANT: Replace "user.id" with the variable you use to capture the user's ID
    name: user.name, // IMPORTANT: Replace "user.name" with the variable you use to capture the user's name
    email: user.email, // IMPORTANT: Replace "user.email" with the variable you use to capture the user's email
    created_at: user.createdAt, // IMPORTANT: Replace "user.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200
  });

  return <div>Example App</div>;
}
```

To display the messenger using custom interactions, please refer to our [developer docs.](https://developers.intercom.com/installing-intercom/web/installation/#basic-javascript)

Give the messenger your own look and feel. Or choose to hide the messenger for specific users and visitors.

![](https://static.intercomassets.com/ember/assets/images/settings/messenger-installation-new/eye-cb480c88f1e740f55dc419b44096d263.svg)

#### Show or hide your messenger

The messenger will be shown to customers after installation, unless you turn this setting off.

Show the messenger

3

### Check the installation

Visit any page with the messenger installed. The messenger will appear in the bottom right-hand corner.

By publishing the Messenger, you agree to the Intercom [Product Privacy Notice](https://www.intercom.com/legal/product-privacy-notice).

Need help? Ask a teammate, like an engineer, to complete the installation. Invite teammate.