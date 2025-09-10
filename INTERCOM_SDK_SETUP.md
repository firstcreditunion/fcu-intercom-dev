# Intercom SDK Integration

## Overview

This Next.js application now uses the official **@intercom/messenger-js-sdk** package for Intercom integration. This provides a more robust, type-safe, and maintainable solution compared to script tag implementations.

## Features

### ✅ **Implementation Highlights:**

- **Official SDK**: Uses `@intercom/messenger-js-sdk` v0.0.17
- **TypeScript Support**: Full type safety and IntelliSense
- **Flexible Authentication**: Supports both anonymous and authenticated users
- **Real-time Controls**: Interactive demo with all Intercom API methods
- **Activity Logging**: Real-time logging of all Intercom actions
- **Australian Region Ready**: Can be configured for Australian data centers

## Files Structure

```
components/
├── IntercomProvider.tsx    # Main provider component
└── IntercomDemo.tsx       # Interactive demo component

app/
├── layout.tsx            # Updated to use IntercomProvider
└── page.tsx             # Updated to show IntercomDemo
```

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Intercom Configuration
NEXT_PUBLIC_INTERCOM_APP_ID=your-app-id-here
```

**Finding your App ID:**

1. Log into your Intercom dashboard
2. Go to Settings → Installation
3. Your App ID is displayed in the installation code
4. It looks like: `app_id: 'a30t2fvp'`

### Australian Region Setup

If you're using Intercom's Australian data center, you'll need to configure the API base URL. The SDK doesn't directly support this in the constructor, but you can set it globally:

```javascript
// Add this to your IntercomProvider before calling Intercom()
window.intercomSettings = {
  api_base: 'https://api-iam.au.intercom.io',
}
```

## Usage Examples

### Anonymous Users (Default)

```javascript
// Automatically initialized for anonymous users
<IntercomProvider>
  <YourApp />
</IntercomProvider>
```

### Authenticated Users

```javascript
<IntercomProvider
  appId='your-app-id'
  userId='user123'
  userName='John Doe'
  userEmail='john@example.com'
  userCreatedAt={1640995200} // Unix timestamp
>
  <YourApp />
</IntercomProvider>
```

### Programmatic Control

The demo component shows how to use Intercom's API methods:

```javascript
// Show messenger
window.Intercom('show')

// Hide messenger
window.Intercom('hide')

// Show messages
window.Intercom('showMessages')

// Show new message with prefilled text
window.Intercom('showNewMessage', 'Hello, I need help with...')

// Update user data
window.Intercom('update', {
  name: 'Updated Name',
  email: 'new@email.com',
  custom_attributes: {
    role: 'Admin',
  },
})

// Shutdown (useful for logout)
window.Intercom('shutdown')
```

## Demo Features

The `IntercomDemo` component provides:

1. **Status Monitoring**: Real-time connection status
2. **Interactive Controls**: Buttons to test all Intercom methods
3. **User Mode Toggle**: Switch between anonymous and authenticated modes
4. **Activity Log**: See all actions and API calls in real-time
5. **Test Data**: Demo user data for testing authenticated features

## Testing

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Visit Your Application**:

   - Open http://localhost:3000
   - The Intercom messenger should appear in the bottom-right corner

3. **Test Features**:

   - Use the demo controls to test messenger functionality
   - Try switching between anonymous and authenticated modes
   - Monitor the activity log for API responses

4. **Check Integration**:
   - Verify the messenger appears
   - Test sending messages
   - Check your Intercom dashboard for conversations

## Troubleshooting

### Common Issues:

1. **Messenger Not Appearing**:

   - Check that your App ID is correct in `.env.local`
   - Verify Intercom is enabled in your dashboard
   - Check browser console for errors

2. **TypeScript Errors**:

   - Ensure `@intercom/messenger-js-sdk` is installed
   - Check that all imports are correct

3. **Australian Region**:
   - Add the `api_base` configuration as shown above
   - Verify your Intercom account is set to Australian region

### Debug Mode:

The demo component includes detailed logging. Check the Activity Log section to see:

- When Intercom initializes
- API method calls and responses
- Error messages
- User data updates

## Production Considerations

1. **Environment Variables**: Ensure `NEXT_PUBLIC_INTERCOM_APP_ID` is set in production
2. **User Data**: Implement proper user authentication and data passing
3. **Privacy**: Configure Intercom's privacy settings as needed
4. **Performance**: The SDK loads asynchronously and won't block page rendering

## API Reference

For complete API documentation, see:

- [Intercom Developer Docs](https://developers.intercom.com/)
- [Messenger SDK GitHub](https://github.com/intercom/messenger-js-sdk)
