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


Routes and Triggers

1. **Follow Request:**
    - Endpoint: /follow
    - Trigger: Sending a follow request to a user.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username"}' http://localhost:3000/follow


2. **Create Post:**
    - Endpoint: /createPost
    - Trigger: Creating a new post with an image and caption.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"imagePath": "/path/to/image.jpg", "caption": "This is the caption"}' http://localhost:3000/createPost


3. **Like Post:**
    - Endpoint: /likePost
    - Trigger: Liking a post by a specific user.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username"}' http://localhost:3000/likePost


4. **Comment on Post:**
    - Endpoint: /commentOnPost
    - Trigger: Adding a comment to a post by a specific user.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username", "commentText": "This is the comment"}' http://localhost:3000/commentOnPost


5. **Scrape User Data:**
    - Endpoint: /scrapeUserData
    - Trigger: Scraping and saving user profile data from Instagram.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username"}' http://localhost:3000/scrapeUserData


6. **Trend Monitoring:**
    - Endpoint: /trendMonitoring
    - Trigger: Monitoring trending hashtags on Instagram.
    - Example CURL: curl -X POST http://localhost:3000/trendMonitoring


7. **Analytics and Reporting:**
    - Endpoint: /analyticsAndReporting
    - Trigger: Analyzing and reporting user analytics.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username"}' http://localhost:3000/analyticsAndReporting


8. **Accept Follow Requests:**
    - Endpoint: /acceptFollowRequests
    - Trigger: Accepting pending follow requests on the Instagram account.
    - Example CURL: curl -X POST http://localhost:3000/acceptFollowRequests


9. **Update Bio:**
    - Endpoint: /update-bio
    - Trigger: Updating the bio (description) of the Instagram account.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username", "newBio": "New bio text"}' http://localhost:3000/update-bio


10. **Update Display Photo:**
    - Endpoint: /update-display-photo
    - Trigger: Updating the display photo (profile picture) of the Instagram account.
    - Example CURL: curl -X POST -H "Content-Type: application/json" -d '{"username": "target_username", "photoPath": "/path/to/new_photo.jpg"}' http://localhost:3000/update-display-photo


Replace target_username with the username of the target user, /path/to/image.jpg with the path to the image file, and /path/to/new_photo.jpg with the path to the new profile photo. Adjust the URL if the server is running on a different port or domain.
Each route handles specific actions and calls the corresponding function to perform those actions. Additionally, error handling middleware is implemented to catch and log any errors that occur during the execution of routes.



### API Rate Limits

Instagram API has rate limits to prevent abuse and ensure fair usage. Exceeding these limits may result in temporary or permanent bans. It's important to handle rate limits responsibly by implementing appropriate rate limiting mechanisms in the application.



With this README, users can understand the purpose of the SocialMedia Bot, how to install and use it, as well as its features and limitations.
