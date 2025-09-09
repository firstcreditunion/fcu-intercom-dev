# Intercom Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Intercom Configuration
# Replace 'your-workspace-id-here' with your actual Intercom Workspace ID
# You can find this in your Intercom dashboard URL after 'apps/'
# For example, if your URL is https://app.intercom.com/a/apps/abc123/home
# then your workspace ID is 'abc123'
NEXT_PUBLIC_INTERCOM_WORKSPACE_ID=your-workspace-id-here
```

## Prerequisites

Before using this integration, ensure you have:

1. **Enabled Messenger for Web** in your Intercom settings:

   - Go to https://app.intercom.com/a/apps/_/settings/web
   - Enable the Messenger for Web (you should see a green checkmark)

2. **Enabled user traffic for messenger**:

   - This must be done BEFORE installation to prevent failed requests
   - Toggle "enable user traffic for messenger" on

3. **Found your Workspace ID**:
   - Log into your Intercom dashboard
   - Look at the URL: `https://app.intercom.com/a/apps/YOUR_WORKSPACE_ID/home`
   - Copy the ID after `apps/`

## Configuration

The integration is configured to use:

- **Australian API Base**: `https://api-iam.au.intercom.io`
- **Anonymous user mode**: No user authentication required
- **Single-Page App method**: Optimized for Next.js

## Testing

1. Start your development server: `npm run dev`
2. Open your application in a browser
3. Look for the Intercom messenger widget in the bottom-right corner
4. Test sending a message

## Troubleshooting

- If the widget doesn't appear, check the browser console for errors
- Ensure your Workspace ID is correct
- Verify that Messenger for Web is enabled in your Intercom settings
- Make sure user traffic is enabled for the messenger
