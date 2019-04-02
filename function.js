      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBxfYq5noAbWU4gA7OJXbSfZNr-ftiOKSQ",
        authDomain: "uniteam-fba5c.firebaseapp.com",
        databaseURL: "https://uniteam-fba5c.firebaseio.com",
        projectId: "uniteam-fba5c",
        storageBucket: "uniteam-fba5c.appspot.com",
        messagingSenderId: "894066322268"
      };
      firebase.initializeApp(config);
                
        // Check to see if you are logged in
        firebase.auth().onAuthStateChanged(function(user) {
            if (user == null) {
                alert("Not logged in.");
                return;
            } else {
                userId = user.uid;
                name = user.displayName;
                imageUrl = user.photoURL;
                email = user.email;
                    
                // write user data to users
                writeUserData(userId, name, email, imageUrl);
                
                // write data to document
                mydiv = document.getElementById("mydata");
                mydiv.innerHTML = name
                myphotodiv = document.getElementById("myphoto");
                myphotodiv.innerHTML = "<img src='" + imageUrl + "' style='border-radius: 50%; height: 100%; cursor: pointer'/>";

                firebase.database().ref('/').once('value').then(function(snapshot) {
                    var data = (snapshot.val());
                    if (data == null) {
                      console.log("No data found at /tweets");  
                    } else {
                      /*
                      console.log(data); 
                      var mylist = "<ul>";
                      for (var u in data) {
                         console.log(data[u]);
                         for (var t in data[u]) {
                            console.log(data[u][t].tweet);
                            mylist = mylist + "<li>" + data[u][t].tweet + "</li>";
                         } 
                      }
                      mylist = mylist + "</ul>";
                        console.log(mylist);
                      var mytdiv = document.getElementById("mytweets");
                      mytdiv.innerHTML = mylist;
                      */
                      updatetweets(data);
                    }
                });
            } // end user null check
        }); // end check auth state
        
        // write user data
        function writeUserData(userId, name, email, imageUrl) {
            firebase.database().ref('users/' + userId).set({
                username: name,
                email: email,
                profile_picture : imageUrl
            });
        }
        
        function updatetweets(data) {
            console.log(data); 
            var mylist = "<ul>";
            for (var u in data.tweets) {
                console.log(data[u]);
                for (var t in data.tweets[u]) {
                    console.log(data.tweets[u][t].tweet);
                    mylist = mylist + "<li>" + data.tweets[u][t].tweet + " (" + data.users[u].email + ")</li>";
                } 
            }
            mylist = mylist + "</ul>";
            console.log(mylist);
            var mytdiv = document.getElementById("mytweets");
            mytdiv.innerHTML = mylist;
        }
        
        // write tweets to firebase
        function tweet() {
            
            twitdoc = document.getElementById("twit");
            var nameValue = twitdoc.value;
            var tweetid = firebase.database().ref('tweets/' + userId + "/").push({tweet: nameValue});
            twitdoc.value = "";
            console.log("tweet written")
            
            firebase.database().ref().once('value').then(function(snapshot) {
                    var data = (snapshot.val());
                    if (data == null) {
                      console.log("No data found at /tweets");  
                    } else {
                      updatetweets(data);
                    }
                });
            
            // The unique key stored in tweetid is based on a timestamp, so list items will automatically be ordered chronologically. Because Firebase generates a unique key for each tweet, no write conflicts will occur if multiple users add a post at the same time. https://firebase.google.com/docs/database/admin/save-data
            
        }
        
        function signin() {
            console.log("Signing in");
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function(result) {  
            });
        }
        
        function signout() {
            console.log("Signing out");
            firebase.auth().signOut().then(function() {
            });
        }