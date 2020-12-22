const port = 500

const Constants = {
    SECRET : "KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm",
    CLIENT_ID : 'KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI',
    EMAIL : "sakshamsharma99@outlook.com",
    PASS : "shutthefuckup123",
    SERVICE : "outlook",

    Routes : {
        default : (port == 5000) ? "/api/" : "/",
        projects : (port == 5000) ? "/api/projects" : "/projects",
        userDetails : (port == 5000) ? "/api/userDetails" : "/userDetails",
        results : (port == 5000) ? "/api/results" : "/results",
        checkUser : (port == 5000) ? "/api/checkUser" : "/checkUser",
        bookmark : (port == 5000) ? "/api/bookmark" : "/bookmark",
        removeBookmark : (port == 5000) ? "/api/removeBookmark" : "/removeBookmark",
        apply : (port == 5000) ? "/api/apply" : "/apply",
        uploadFile : (port == 5000) ? "/api/uploadFile" : "/uploadFile",
        port : port,
    }

}


module.exports = {
  Constants : Constants
}
