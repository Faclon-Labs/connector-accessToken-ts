import { UserAccess, UserDetailsHeaders, UserQuotaResponse } from './connectors/UserAccess.js';

async function testUserQuota() {
  const dataUrl = 'appserver.iosense.io'; // Replace with your backend URL
  const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..0hqATd4sOlYpukAX.MsHIFjsVYcagle2obgj4qv4iS5wPMkak1XiDpyAr9s-S_RRn4fAt_vzPAIkW7BVnV3UaNyYBIf6NKHg0tMce5Da9EToE4D7LE5E2IdwyVbeQqesKptCzBheyzwPYHXy3DTk756mCPX0-vVus6H5gvit31FQ8ks5yrlHfgtKGgGdiP1lB2b0XGNYWVwJ49uUJvc0uGAeuXRZ6XnalPj0_4JrwXBfb0jbkH4DCcPYRa6KCfVqxHsWSpQngTMn0fsHGv-4zjWvFT8RstsMmQa7fzjmljnzXvJRCchYOVc6VHl_KXz0qMjQ-mrFUz4wtOY6UcYndXN6ax9CuwvNEXlw4Eq6e9qkskT8RMc0bC0hPGFV9SazUMo6SCTfK8qVd5r2XfL6mfn3fSQJndoTg2BXKfeYqn_QlXKh2wvMdBJyj1dJkOjJT1RUSStVeu_JrSSiVXMmveD2ho46Dmns-Gtr-aAE-qnU.n92Wp_fcDfSStG4R0ECTnw';
  const onPrem = false; // Set to true if on-premise (http), false for https

  const userAccess = new UserAccess(dataUrl, accessToken, onPrem);

  const extraHeaders: Partial<UserDetailsHeaders> = {
    origin: 'https://iosense.io',
    // organisation: 'your_organisation',
    // 'x-real-ip': '127.0.0.1',
    // 'user-agent': 'CustomAgent',
    // fcmToken: 'optional_token',
  };

  const quotaResponse: UserQuotaResponse | null = await userAccess.getUserQuota(extraHeaders);
  console.log('User quota response:', quotaResponse);
}

testUserQuota(); 