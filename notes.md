Note: make sure to install firebase globally in your laptop!

IMPORTANT
- 
- Before deploying, add the environment variables to vercel
- rename @firebaseUtils/auth files to an appropriate name for client-side log-in and sign-up
- Double check env file

Not as important
- 
- make a pretty loader
- I feel like firebaseUtils' 'initAuth' should only be called once

NOTES
- 
- PAU ERROR: u added single qoutes to the private key local environment variable, and u updated firebaseAdmin.ts
- Remember that you can call your firebase-admin object from getFirebaseAdmin
- next-firebase-auth Docs: https://github.com/gladly-team/next-firebase-auth/tree/main#API
- Issue - vercel, storing complex secrets: https://github.com/vercel/vercel/issues/749#issuecomment-707515089
- 

TODO NEXT
- 
- create sign up page, no need to be functional yet
- implement photoURL storageBucket function
- complete sign up API endpoint
- 

TODO
-
- Create app container component [done]
- Rewrite nav layout
- Refactor Nav Bar (desktop)
- Refactor Nav Bar (mobile)


- Clean up bg video component [done]
- Add missing index page without dummy data
- Add missing chat page
- Add missing request page without dummy data
- Add missing account page without dummy data


- Create sign in button
- Create user auth context