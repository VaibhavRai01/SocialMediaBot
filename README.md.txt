**SocialMedia Bot**



### Overview

SocialMedia Bot is a Node.js application designed to automate various interactions and tasks on Instagram. It utilizes the Instagram Private API to perform actions such as sending follow requests, creating posts, liking posts, commenting on posts, updating user bio and display photo, as well as monitoring trends and analyzing user analytics.



### Features

- **Follow Request:** Send follow requests to specified Instagram users.
- **Create Post:** Create new posts on Instagram with images and captions.
- **Like Post:** Like posts by specified Instagram users.
- **Comment on Post:** Add comments to posts by specified Instagram users.
- **Scrape User Data:** Scrape and save user profile data from Instagram.
- **Trend Monitoring:** Monitor trending hashtags on Instagram.
- **Analytics and Reporting:** Analyze and report user analytics including engagement rate, follower count, and following count.
- **Accept Follow Requests:** Accept pending follow requests on the Instagram account.
- **Update Bio:** Update the bio (description) of the Instagram account.
- **Update Display Photo:** Update the display photo (profile picture) of the Instagram account.



### Installation

1. Clone the repository:

2. Install dependencies:

3. Set up environment variables:



### Usage

1. Start the server:
  
2. Access the endpoints using HTTP requests:
   - Follow Request: `POST /follow`
   - Create Post: `POST /createPost`
   - Like Post: `POST /likePost`
   - Comment on Post: `POST /commentOnPost`
   - Scrape User Data: `POST /scrapeUserData`
   - Trend Monitoring: `POST /trendMonitoring`
   - Analytics and Reporting: `POST /analyticsAndReporting`
   - Accept Follow Requests: `POST /acceptFollowRequests`
   - Update Bio: `POST /update-bio`
   - Update Display Photo: `POST /update-display-photo`



### Functions:

1. **login():**
   - This function handles the login process to Instagram using the provided username and password.
   - It initializes the Instagram client (`ig`) and simulates the pre-login and post-login flow.
   - Returns the logged-in user object upon successful login.

2. **sendFollowRequest(username):**
   - Sends a follow request to the specified Instagram user.
   - Requires the username of the target user as a parameter.
   - Uses the `login()` function to authenticate and then sends the follow request using `ig.friendship.create(userId)`.

3. **createPost(imagePath, caption):**
   - Creates a new post on Instagram with the provided image and caption.
   - Requires the file path of the image and the caption as parameters.
   - Uses the `login()` function to authenticate and then resizes and formats the image using Jimp.
   - Finally, it publishes the photo with the caption using `ig.publish.photo()`.

4. **scrapeUserData(username):**
   - Scrapes and saves user data for the specified Instagram username.
   - Requires the username of the target user as a parameter.
   - Uses the `login()` function to authenticate and then fetches user information using `ig.user.info(userId)`.
   - Saves or updates the user profile data in the MongoDB database using Mongoose.

5. **trendMonitoring():**
   - Monitors trending hashtags on Instagram.
   - Uses the `login()` function to authenticate and then fetches recent posts using `ig.feed.tags().items()`.
   - Parses the captions of posts to extract hashtags and counts their occurrences.
   - Returns the top three trending hashtags of the day.

6. **analyticsAndReporting(username):**
   - Analyzes and reports user analytics for the specified Instagram username.
   - Requires the username of the target user as a parameter.
   - Uses the `login()` function to authenticate and then fetches user profile data from the MongoDB database.
   - Calculates engagement rate, follower count, and following count based on the retrieved data.

7. **acceptFollowRequests():**
   - Accepts pending follow requests on the Instagram account.
   - Uses the `login()` function to authenticate and then fetches pending follow requests using `ig.feed.pendingFriendships().items()`.
   - Approves each follow request using `ig.friendship.approve(user.pk)`.

8. **likeOnPost(username):**
   - Likes a post by the specified Instagram user.
   - Requires the username of the target user as a parameter.
   - Uses the `login()` function to authenticate and then fetches the latest media ID of the user's post using `getMediaIdByUsername(username)`.
   - Likes the post using `ig.media.like()`.

9. **commentOnPost(username, commentText):**
   - Adds a comment to a post by the specified Instagram user.
   - Requires the username of the target user and the comment text as parameters.
   - Uses the `login()` function to authenticate and then fetches the latest media ID of the user's post using `getMediaIdByUsername(username)`.
   - Adds the comment using `ig.media.comment()`.

10. **updateBio(username, newBio):**
    - Updates the bio (description) of the Instagram account.
    - Requires the username of the Instagram account and the new bio text as parameters.
    - Uses the `login()` function to authenticate and then updates the bio using `ig.account.editProfile()`.

11. **updateDisplayPhoto(username, photoPath):**
    - Updates the display photo (profile picture) of the Instagram account.
    - Requires the username of the Instagram account and the file path of the new profile picture as parameters.
    - Uses the `login()` function to authenticate and then updates the display photo using `ig.account.changeProfilePicture()`.



### Routes:

1. **POST /follow:**
   - Endpoint to send a follow request to a specified Instagram user.
   - Requires the `username` of the target user in the request body.
   - Calls the `sendFollowRequest(username)` function.

2. **POST /createPost:**
   - Endpoint to create a new post on Instagram.
   - Requires the `imagePath` (file path of the image) and `caption` in the request body.
   - Calls the `createPost(imagePath, caption)` function.

3. **POST /likePost:**
   - Endpoint to like a post by a specified Instagram user.
   - Requires the `username` of the target user in the request body.
   - Calls the `likeOnPost(username)` function.

4. **POST /commentOnPost:**
   - Endpoint to add a comment to a post by a specified Instagram user.
   - Requires the `username` of the target user and the `commentText` in the request body.
   - Calls the `commentOnPost(username, commentText)` function.

5. **POST /scrapeUserData:**
   - Endpoint to scrape and save user data for a specified Instagram username.
   - Requires the `username` of the target user in the request body.
   - Calls the `scrapeUserData(username)` function.

6. **POST /trendMonitoring:**
   - Endpoint to monitor trending hashtags on Instagram.
   - No request body required.
   - Calls the `trendMonitoring()` function.

7. **POST /analyticsAndReporting:**
   - Endpoint to analyze and report user analytics for a specified Instagram username.
   - Requires the `username` of the target user in the request body.
   - Calls the `analyticsAndReporting(username)` function.

8. **POST /update-bio:**
   - Endpoint to update the bio (description) of the Instagram account.
   - Requires the `username` of the Instagram account and the `newBio` text in the request body.
   - Calls the `updateBio(username, newBio)` function.

9. **POST /update-display-photo:**
   - Endpoint to update the display photo (profile picture) of the Instagram account.
   - Requires the `username` of the Instagram account and the `photoPath` (file path of the new profile picture) in the request body.
   - Calls the `updateDisplayPhoto(username, photoPath)` function.

Each route handles specific actions and calls the corresponding function to perform those actions. Additionally, error handling middleware is implemented to catch and log any errors that occur during the execution of routes.



### API Rate Limits

Instagram API has rate limits to prevent abuse and ensure fair usage. Exceeding these limits may result in temporary or permanent bans. It's important to handle rate limits responsibly by implementing appropriate rate limiting mechanisms in the application.



With this README, users can understand the purpose of the SocialMedia Bot, how to install and use it, as well as its features and limitations.