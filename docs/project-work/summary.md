# Project summary

I built a general marketplace site.

## Features

- User registration and login
- Secure password storage with bcrypt
- User authentication with JWT
- The main marketplace part needs authentication, but other parts of the site are public (e.g. landing, auth, tos, privacy policy)
- User roles (normal and admin) with different permissions
  - Admins can update/delete any user or listing
  - Admin can view any users email address. Normal users can only view their own email address.
- Users can create, update & delete their own listings
- Users can view all listings
- Users can view listings per user
- Users can be searched by name
- Listings have full text search (searches title, description, category, location)
- Listings can have multiple links to images
- Backend creates [BlurHashes](https://blurha.sh/) for images that act as placeholders while the images are loading. (only for the listing view)
- Listings have:

  - Title
  - Description
  - Category
  - Location
  - Owner
  - Price
  - Currency
  - Image links

- Settings page where users can update their name, email address and password
- Users can delete their account
- Forgot password functionality (sends an email with a link to reset password, expires after 30 min)
- Site auto logouts users as the session expires (1 hour). Users can also logout manually.
- Responsive site design: works on mobile and desktop. Sidebar is behind a hamburger menu on mobile.

### Problems

I had some problems with the backend tests due to async code that left connections open and caused the tests to fail randomly. Also with database stuff, as I decided to change the DB along the way and that caused way too much work. (I blame Tamk for this one, as their MySQL server permissions are too strict)...

There's more stuff about the problems in [problems.md](problems.md).

Stuff in general took way too much time, but I guess that's what happens when you try to do stuff in a semi overengineered way when a simple solution would have been enough.

Also the fact that I wanted to learn new stuff ([learning.md](learning.md)) I hadn't used before certainly didn't help.

## Deployed site

backend: https://marketplace-backend-bcxi.onrender.com

frontend: https://marketplace-frontend-yxv8.onrender.com

db: MySQL on AWS RDS (Learner Lab, so it will be gone after the course)

## Video demo

> **Warning** video is 32 minutes long.
> [![Video demo](https://img.youtube.com/vi/6sgb86AS98o/0.jpg)](https://youtu.be/6sgb86AS98o)
