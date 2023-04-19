Note: make sure to install firebase globally in your laptop!

IMPORTANT
-

Find out what is causing deployment of firebase functions to fail. Likely have not set up function service correctly.

Firebase Logs:

`
TypeError: Cannot read properties of undefined (reading 'service')
at C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\functions\backend.js:198:113
at Array.map (<anonymous>)
at loadExistingBackend (C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\functions\backend.js:198:69)
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async Object.existingBackend (C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\functions\backend.js:174:9)
at async prepare (C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\functions\prepare.js:138:115)
at async chain (C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\index.js:35:9)
at async deploy (C:\Users\luise\AppData\Roaming\npm\node_modules\firebase-tools\lib\deploy\index.js:79:5)
`

Google Cloud Console Message:

`
This function has previously failed to deploy or is in a broken state. Some input fields and advanced settings may have been restored to their default values. Please review the configuration settings and code before redeploying this function.
`


RESOURCES
-
Official Vercel Firebase Hosted Example:
https://github.com/vercel/next.js/blob/canary/examples/with-firebase-hosting/README.md

Firebase Hosting Articles
- https://dev.to/rowaxl/what-i-struggled-with-next-js-using-firebase-hosting-and-enable-ssr-4e67
- https://itnext.io/deploying-next-js-app-to-firebase-functions-eb473791d79e
- https://articles.wesionary.team/deploy-next-js-application-with-ssr-using-firebase-cloud-functions-551cb67f4db2
- https://codeburst.io/next-js-on-cloud-functions-for-firebase-with-firebase-hosting-7911465298f2

GitHub Repo of Firebase Framework Tools
https://github.com/FirebaseExtended/firebase-framework-tools

Next.js + Firebase (Auth & Firestore) - YouTube Video Example
https://www.youtube.com/watch?v=UzMr7-0FgA0

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