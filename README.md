#mylist-ott

#Application setup
 1.  clone this repository from github
 https://github.com/kashyapabhay/mylist-ott.git
 2. Open Ide on this checked out code.

 3. run npm install to download required node modules

 4. create a .env file in the root directory

 5. add the following to your .env file
PORT=3000
MONGODB_URI=mongodb+srv://dev:terminator_89@learning.y1x76.mongodb.net/test?retryWrites=true&w=majority
// USE THE mongo url along with db name
#mylist service cofig
MYLIST_CACHE_INTERVAL=720 # in minutes
#Redis configuration
ENABLE_REDIS_CACHE=false
REDIS_URL=redis://localhost:6379
//keep the ENABLE_REDIS_CACHE flag to false if you do not want to use redis caching.

6. create database schema using the queries given in mongo-queries.txt

7. try to start the application using npm run start . Application should be running on configured port

8. #Data generation
i -> run "node scripts/create-users.js" 
ii -> run "node scripts/create-movies.js"
iii -> run "node scripts/create-tvshows.js"
iv -> move the generated user.csv ,movie.csv and tvshow.csv to script folder
v -> run "node scripts/add-to-mylist.js"


#Refer to :Design-Document.md for design decisions

