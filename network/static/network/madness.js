document.addEventListener('DOMContentLoaded', function() {
    load_posts();
    document.querySelector('#post-form').addEventListener('submit', send_data);
});

function send_data(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("TEST SEND");

    const textarea = document.querySelector("#textarea").value;
    const user = document.querySelector("#username").value;
    const timestamp = new Date().toISOString();

    const postData = {
        text: textarea,
        user: user,
        time: timestamp,
    };

    fetch('/post', {  // URL matches the endpoint in your Django URLs
        method: 'POST',
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        location.reload();
    });
}

function load_posts() {
    console.log("TEST LOAD");

    fetch('/post')  // URL matches the endpoint in your Django URLs   
        .then(response => response.json())
        .then(posts => {
            posts.reverse();
            posts.forEach(post => {
                const { likes, user, user_id,id, content, timestamp } = post; // Access fields object
                const postBox = document.createElement('div');
                postBox.classList.add('post-box');
                postBox.style.border = '0.5px solid black'; // Adding border
                postBox.style.alignItems = 'center';
                postBox.style.justifyContent = 'space-between';
                postBox.style.padding = '10px';
                postBox.style.marginLeft = '30px';
                postBox.style.marginRight = '10px';

                const uname = document.createElement('p');
                uname.innerText = `${user}`;
                uname.style.color = 'blue';
                uname.style.fontFamily = 'Georgia';
                uname.style.fontWeight = 'bold';

                uname.addEventListener('click', () => {
                    // Define the function to be executed when the user name is clicked
                    upage(user_id);
                });

                const body = document.createElement('p');
                body.innerText = `${content}`;
                body.style.fontFamily = 'Courier';

                const like = document.createElement('p');
                like.innerText = `${likes}`;
            // Create and append the LIKE button
                    const likeButton = document.createElement('button');
                    likeButton.innerText = 'LIKE';
                    likeButton.style.backgroundColor = 'blue';
                    likeButton.style.color = 'white';
                    likeButton.style.border = 'none';
                    likeButton.style.padding = '5px 10px';
                    likeButton.style.cursor = 'pointer';
                    likeButton.addEventListener('click', () => {
                        if (likeButton.innerText === 'LIKE') {
                            likeButton.innerText = 'UNLIKE';
                            fetch(`/post/${id}`, {
                                method: 'PUT',
                                body: JSON.stringify({
                                    likes: true
                                })
                            })
                            .then(response => {
                                if (response.status === 201) {
                                    location.reload();
                                    
                                }
                            })
                        } else if (likeButton.innerText === 'UNLIKE') {
                            likeButton.innerText = 'LIKE'; // Reset the button text back to LIKE
                            fetch(`/post/${id}`, {
                                method: 'PUT',
                                body: JSON.stringify({
                                    unlikes: true
                                })
                            })
                            .then(response => {
                                if (response.status === 201) {
                                    console.log("UNLIKED");
                                   
                                    location.reload();
                                }
                            })
                        }
                    });

        // Append the button to the appropriate element in the UI
        // ...

                        
                    

                

                // Append the elements in the desired order
                postBox.appendChild(uname);
                postBox.appendChild(body);
                postBox.appendChild(like);
                postBox.appendChild(likeButton);

                const timeLabel = document.createElement('p'); // Adding timestamp
                timeLabel.style.fontWeight = 'bold';
                timeLabel.style.fontFamily = 'italic';
                timeLabel.innerText = `${timestamp}`;
                postBox.appendChild(timeLabel);

                postBox.style.backgroundColor = 'white';

                // Append the postBox to the view container
                document.querySelector('#view').appendChild(postBox);

                // Create and append a horizontal rule (hr) after the postBox
                const horizontalLine = document.createElement('hr');
                document.querySelector('#view').appendChild(horizontalLine);
            });
        });
}


function upage(user_id) {
    console.log("TEST USERPAGE");


     // Fetch and display user data
     fetch(`/followers/${user_id}`)
     .then(response => response.json())
     .then(fl => {
        const { followers } = fl;
        console.log(followers)})



    
    // Hide the main view and post-form
    document.querySelector('#view').style.display = 'none';
    document.querySelector('#post-form').style.display = 'none';
    document.querySelector('h3').style.display = 'none';
    document.querySelector('h1').style.display = 'none';
    
    // Clear the user page container
    const viewuserContainer = document.querySelector('#viewuser');
    viewuserContainer.innerHTML = '';

    // Fetch and display user data
    fetch(`/username/${user_id}`)
        .then(response => response.json())
        .then(user => {
            const { id, username, email } = user;
            const h4Element = document.createElement('h4');
            console.log(username);
            h4Element.textContent = username;
            h4Element.style.border = '0.5px solid black'; // Adding border
            h4Element.style.alignItems = 'center';
            h4Element.style.textAlign = 'center';
            h4Element.style.color = 'red';
            h4Element.style.marginLeft = '100px';
            h4Element.style.marginRight = '100px';
            document.querySelector('#us').appendChild(h4Element);})
    
            const FollowButton = document.createElement('button');
            FollowButton.innerText = 'Follow';
            FollowButton.style.backgroundColor = 'Red';
            FollowButton.style.color = 'white';
            FollowButton.style.border = 'none';
            FollowButton.style.borderRadius = '30px';
            FollowButton.style.alignItems = 'center';
            FollowButton.style.padding = '5px 10px';
            FollowButton.style.cursor = 'pointer';
            FollowButton.style.textAlign = 'center';
            FollowButton.style.marginLeft = '50%';

            FollowButton.addEventListener('click', () => {
                // Define the function to be executed when the Follow button is clicked
                if (FollowButton.innerText === 'Follow') {
                    FollowButton.innerText = 'UnFollow';
                    fetch(`/follow/${user_id}`)
                    .then(response => response.json())
                    
                } else {
                    FollowButton.innerText = 'Follow';
                }
            });
            document.querySelector('#follow').appendChild(FollowButton);
        

             

    fetch(`/user/${user_id}`)// URL matches the endpoint in your Django URLs   
        .then(response => response.json())
        .then(posts => {
            posts.reverse();
            posts.forEach(post => {
                console.log("TESTINGGGGGGGGGGGGGGGGGGGGGGGGGG");
                const { likes, user_id,user, id, content, timestamp } = post; // Access fields object
                const Box = document.createElement('div');
                Box.classList.add('post-box');
                Box.style.border = '0.5px solid black'; // Adding border
                Box.style.alignItems = 'center';
                Box.style.justifyContent = 'space-between';
                Box.style.padding = '10px';
                Box.style.marginLeft = '30px';
                Box.style.marginRight = '10px';

                const uname = document.createElement('p');
                uname.innerText = `${user}`;
                uname.style.color = 'blue';
                uname.style.fontFamily = 'Georgia';
                uname.style.fontWeight = 'bold';
                uname.style.cursor = 'pointer';

                uname.addEventListener('click', () => {
                    // Define the function to be executed when the user name is clicked
                    upage(user_id);
                });

                const body = document.createElement('p');
                body.innerText = `${content}`;
                body.style.fontFamily = 'Courier';

                const like = document.createElement('p');
                like.innerText = `${likes}`;

                // Create and append the LIKE button
                const likeButton = document.createElement('button');
                likeButton.innerText = 'LIKE';
                likeButton.style.backgroundColor = 'blue';
                likeButton.style.color = 'white';
                likeButton.style.border = 'none';
                likeButton.style.padding = '5px 10px';
                likeButton.style.cursor = 'pointer';
                likeButton.addEventListener('click', () => {
                    fetch(`/post/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            likes: true
                        })
                    })
                    .then(response => {
                        if (response.status === 204) {
                            // Update the like count in the UI
                            
                            // Refresh the page after successful like update
                            location.reload();
                        }
                    })
                   
                    
                });
                

                // Append the elements in the desired order
                Box.appendChild(uname);
                Box.appendChild(body);
                Box.appendChild(like);
                Box.appendChild(likeButton);

                const timeLabel = document.createElement('p'); // Adding timestamp
                timeLabel.style.fontWeight = 'bold';
                timeLabel.style.fontFamily = 'italic';
                timeLabel.innerText = `${timestamp}`;
                Box.appendChild(timeLabel);

                Box.style.backgroundColor = 'white';

                // Append the postBox to the view container
                document.querySelector('#viewuser').appendChild(Box);

                // Create and append a horizontal rule (hr) after the postBox
                const horizontalLine = document.createElement('hr');
                document.querySelector('#viewuser').appendChild(horizontalLine);

            });
        });
}
   