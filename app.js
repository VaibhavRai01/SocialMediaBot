const { IgApiClient } = require('instagram-private-api');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { readFile } = require('fs').promises;
const Jimp = require('jimp');
const express = require('express');
const bodyParser = require('body-parser');

const UserProfile = require('./models/userProfile');

const ig = new IgApiClient();
const app = express();

app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function login() {
    ig.state.generateDevice("username");
    
    try {

        await ig.simulate.preLoginFlow();
        const loggedInUser = await ig.account.login("username", "password");
        await ig.simulate.postLoginFlow();
        console.log('Login successful');
        return loggedInUser;
    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
}

async function sendFollowRequest(username) {
    try {
        await login();
        const userId = await ig.user.getIdByUsername(username);
        await ig.friendship.create(userId);
        console.log(`Sent follow request to: ${username}`);
    } catch (err) {
        console.error(`Failed to send follow request to ${username}:`, err);
        throw err;
    }
}

async function createPost(imagePath, caption) {
    try {
        await login();
        const formattedImagePath = path.join(__dirname, 'formatted_image.jpg');
        const image = await Jimp.read(imagePath);
        await image.resize(1080, 1080).quality(80).writeAsync(formattedImagePath);

        const imageBuffer = await readFile(formattedImagePath);

        const publishResult = await ig.publish.photo({
            file: imageBuffer,
            caption: caption,
        });

        console.log(`Posted a new photo with caption: ${caption}`);
        return publishResult.media.id;
    } catch (err) {
        console.error(`Failed to create post:`, err);
        throw err;
    }
}

async function scrapeUserData(username) {
    try {
        await login();
        const userId = await ig.user.getIdByUsername(username);
        const userInfo = await ig.user.info(userId);

        const userProfile = await UserProfile.findOneAndUpdate(
            { username: username },
            {
                $set: {
                    fullName: userInfo.full_name,
                    followerCount: userInfo.follower_count,
                    followingCount: userInfo.following_count,
                    postCount: userInfo.media_count,
                    bio: userInfo.biography,
                    profilePicUrl: userInfo.profile_pic_url
                }
            },
            { new: true, upsert: true }
        );
        console.log(`Saved or updated user profile for: ${username}`);
        console.log(userProfile);
    } catch (err) {
        console.error(`Failed to scrape user data for ${username}:`, err);
        throw err;
    }
}

async function trendMonitoring() {
    try {
        await login();
        const tagsFeed = ig.feed.tags();
        const posts = await tagsFeed.items();

        const hashtagCounts = {};

        posts.forEach(post => {
            try {
                if (post.caption && post.caption.text) {
                    const hashtags = post.caption.text.match(/#[^\s#]+/g);
                    if (hashtags) {
                        hashtags.forEach(tag => {
                            if (!hashtagCounts[tag]) {
                                hashtagCounts[tag] = 1;
                            } else {
                                hashtagCounts[tag]++;
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing post:', error);
            }
        });

        const sortedHashtags = Object.entries(hashtagCounts)
            .sort((a, b) => b[1] - a[1]);

        const topHashtags = sortedHashtags.slice(0, 3).map(entry => entry[0]);

        console.log(`Top three hashtags of the day: ${topHashtags.join(', ')}`);
        return topHashtags;
    } catch (err) {
        console.error('Failed to monitor trends:', err);
        throw err;
    }
}

async function analyticsAndReporting(username) {
    try {
        await login();
        const userProfile = await UserProfile.findOne({ username });

        if (!userProfile) {
            console.log(`No data found for user: ${username}`);
            return;
        }

        const engagement = userProfile.followerCount / userProfile.postCount;
        const followerCount = userProfile.followerCount;
        const followingCount = userProfile.followingCount;

        console.log(`User: ${userProfile.username}`);
        console.log(`Engagement rate: ${engagement}`);
        console.log(`Follower Count: ${followerCount}`);
        console.log(`Following Count: ${followingCount}`);
        console.log('Other Details', userProfile);
    }
    catch (err) {
        throw err;
    }
}

async function acceptFollowRequests() {
    try {
        await login();
        const requestsFeed = ig.feed.pendingFriendships();
        let requests = await requestsFeed.items();

        while (requests.length) {
            for (let user of requests) {
                await ig.friendship.approve(user.pk);
                console.log(`Accepted follow request from: ${user.username}`);
            }
            requests = await requestsFeed.items();
        }
    } catch (err) {
        console.error('Failed to accept follow requests:', err);
        throw err;
    }
}

async function likeOnPost(username) {
    try {
        await login();
        const mId = await getMediaIdByUsername(username);
        await ig.media.like({
            mediaId: mId,
            moduleInfo: {
                module_name: 'profile',
            },
            d: 1,
        });
        console.log(`Liked post with ID: ${mId}`);
    } catch (err) {
        console.error(`Failed to like on post:`, err);
        throw err;
    }
}

async function commentOnPost(username, commentText) {
    try {
        await login();
        const mId = await getMediaIdByUsername(username);
        await ig.media.comment({
            mediaId: mId,
            text: commentText,
        });
        console.log(`Commented on post with ID: ${mId}`);
    } catch (err) {
        console.error(`Failed to comment on post:`, err);
        throw err;
    }
}

async function updateBio(username, newBio) {
    try {
        await login();
        const userId = await ig.user.getIdByUsername(username);
        await ig.account.editProfile({
            biography: newBio,
            username: username,
        });
        console.log(`Updated bio for ${username} to: ${newBio}`);
    } catch (err) {
        console.error(`Failed to update bio for ${username}:`, err);
        throw err;
    }
}

async function updateDisplayPhoto(username, photoPath) {
    try {
        await login();
        const imageBuffer = await readFile(photoPath);
        await ig.account.changeProfilePicture(imageBuffer);
        console.log(`Updated display photo for ${username}`);
    } catch (err) {
        console.error(`Failed to update display photo for ${username}:`, err);
        throw err;
    }
}

async function getMediaIdByUsername(username) {
    try {
        await login();
        const userId = await ig.user.getIdByUsername(username);
        const userFeed = ig.feed.user(userId);
        const posts = await userFeed.items();
        if (posts.length > 0) {
            console.log(`Media ID for the latest post by ${username}: ${posts[0].id}`);
            return posts[0].id;
        } else {
            console.log(`No posts found for user ${username}`);
        }
    } catch (err) {
        console.error(`Failed to get media ID by username ${username}:`, err);
        throw err;
    }
}

// Route to send a follow request
app.post('/follow', async (req, res) => {
    try {
        const { username } = req.body;
        await sendFollowRequest(username);
        res.send('Follow request sent');
    } catch (err) {
        res.status(500).send('Failed to send follow request');
    }
});

// Route to accept follow requests
app.post('/acceptFollowRequests', async (req, res) => {
    try {
        await acceptFollowRequests();
        res.send('Follow requests accepted');
    } catch (err) {
        res.status(500).send('Failed to accept follow requests');
    }
});

// Route to create a post
app.post('/createPost', async (req, res) => {
    try {
        const { imagePath, caption } = req.body;
        await createPost(imagePath, caption);
        res.send('Post created');
    } catch (err) {
        res.status(500).send('Failed to create post');
    }
});

// Route to like a post
app.post('/likePost', async (req, res) => {
    try {
        const { username } = req.body;
        await likeOnPost(username);
        res.send('Post liked');
    } catch (err) {
        res.status(500).send('Failed to like post');
    }
});

// Route to comment on a post
app.post('/commentOnPost', async (req, res) => {
    try {
        const { username, commentText } = req.body;
        await commentOnPost(username, commentText);
        res.send('Comment added');
    } catch (err) {
        res.status(500).send('Failed to add comment');
    }
});

// Route to scrape user data
app.post('/scrapeUserData', async (req, res) => {
    try {
        const { username } = req.body;
        await scrapeUserData(username);
        res.send('User data scraped and saved');
    } catch (err) {
        res.status(500).send('Failed to scrape user data');
    }
});

// Route to monitor trends
app.post('/trendMonitoring', async (req, res) => {
    try {
        await trendMonitoring();
        res.send('Trend monitoring completed');
    } catch (err) {
        res.status(500).send('Failed to monitor trends');
    }
});

// Route to analyze and report
app.post('/analyticsAndReporting', async (req, res) => {
    try {
        const { username } = req.body;
        await analyticsAndReporting(username);
        res.send('Analysis and reporting completed');
    } catch (err) {
        res.status(500).send('Failed to analyze and report');
    }
});

// Route to update bio
app.post('/update-bio', async (req, res) => {
    try {
        const { username, newBio } = req.body;
        await updateBio(username, newBio);
        res.send(`Bio updated for ${username}`);
    } catch (err) {
        res.status(500).send('Failed to update bio');
    }
});

// Route to update display photo
app.post('/update-display-photo', async (req, res) => {
    try {
        const { username, photoPath } = req.body;
        await updateDisplayPhoto(username, photoPath);
        res.send(`Display photo updated for ${username}`);
    } catch (err) {
        res.status(500).send('Failed to update display photo');
    }
});

async function main() {
    try {
        await mongoose.connect("mongodb://localhost:27017/SocialMedia", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

main().catch(console.error);
