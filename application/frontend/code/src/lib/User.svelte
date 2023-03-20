
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

  import { user } from "../user-store";

    

    class WishList {
          constructor(itemName, purchased) {
              this.itemName = itemName;
              this.purchased = purchased;
          }
      }
  
    var arrayOfWishes = []
  
    arrayOfWishes.push(new WishList("A horse", "Ricky229")) 
    arrayOfWishes.push(new WishList("5000 $", ""))
    arrayOfWishes.push(new WishList("Food", "")) 
    arrayOfWishes.push(new WishList("A new iPhone", "user_2883"))
  
  export let id;
  let isFetchingUser = true
  let failedToFetchUser = false
  let fetchedUser = null
  let fetchedFollow = null
  let resourceForbidden = false

  async function loadUser(){
    console.log("going into loadUser")
    try {
      const response = await fetch("http://localhost:8080/users/" + id, {
        method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
          "UserID": $user.userID
				}
      })
      
      switch(response.status) {
        
        case 200:
          console.log("user/id got 200")
          const {userToSend, followToSend} = await response.json()
          console.log("users kommer nu: " + userToSend, followToSend)
          fetchedUser = userToSend
          fetchedFollow = followToSend
          console.log(fetchedFollow[0])
          isFetchingUser = false
          break
        
        case 404:
          isFetchingUser = false

        case 403:
          resourceForbidden = true
          break

      }

    } catch (error) {
      failedToFetchUser = true
      failedToFetchUser = true
    }
  }

  loadUser()

  async function followUser(){
    console.log("clicked follow")
    try {
      const response = await fetch("http://localhost:8080/follows/follow", {
        method: "POST",
				headers: {
					"Content-Type": "application/json",
          "Authorization": "bearer "+$user.accessToken,
					"UserToFollow": id,
          "UserID": $user.userID
				}
      })
      
      switch(response.status) {
        
        case 201:
          loadUser()
          break
        
        case 404:
          
      }

    } catch (error) {
      
    }
  }

  let unableToUnfollow = false

  async function unfollowUser(){
    console.log("clicked unfollow")
    try {
      const response = await fetch("http://localhost:8080/follows/unfollow", {
        method: "DELETE",
				headers: {
					"Content-Type": "application/json",
          "Authorization": "bearer "+$user.accessToken,
					"UserToUnfollow": id,
          "UserID": $user.userID
				}
      })
      
      switch(response.status) {
        
        case 204:
          loadUser()
          break
        
        case 500:
          unableToUnfollow = true
          break
          

      }

    } catch (error) {
      
    }

  }

</script>
<body>

  {#if $user.isLoggedIn}

  {#if resourceForbidden}
    <p>You can not view yourself</p>
  {:else}
  {#if isFetchingUser}
    <p>Wait, fetching data...</p>
  {:else if failedToFetchUser}
    <p>Couldn't fetch user. Check your Internet connection.</p>
  {:else if fetchedUser}
    <title></title>

    <div id="profile">
      <h1>{fetchedUser[0].username}</h1>
      {#if fetchedFollow[0]}
        <button class="follow-button following" on:click={unfollowUser}>Following</button>
      {:else}
        <button class="follow-button" on:click={followUser}>Follow</button>
      {/if}

      {#if unableToUnfollow}
        <p>Unable to unfollow user</p>
      {/if}
      
      <div class="wish-list">
        <div class="wish-item">
          <div class="wish-title">Buy groceries</div>
          <div class="done-checkbox">✓</div>
        </div>
        <div class="wish-item done">
          <div class="wish-title">Finish project</div>
          <div class="done-checkbox done">✓</div>
        </div>
        <div class="wish-item">
          <div class="wish-title">Do laundry</div>
          <div class="done-checkbox">✓</div>
        </div>
      </div>
    </div>
    <!--
      <div class="mainGrid">
          <div class="leftColumn">
            <div class="test">
              <p>{singleUser.username}</p>
            </div>
            
            <button class="followButton"><i class="fa-solid fa-plus"></i> Follow </button>
          </div>

          <div id="wishListObject">
            <p class="title">
              {singleUser.username}'s Wish List
            </p>
            
            <div class="wishList">
              {#each arrayOfWishes as wish}
              <div class="item">

                <div class="item-btn">
                  {#if wish.purchased}
                    <i class="fa-regular fa-square-check"></i>
                  {:else}
                    <i class="fa-regular fa-square"></i>
                  {/if}
                  
                </div>
                
                <p id="itemTitle">{wish.itemName}</p>

              </div>
              {/each}

            </div>
          </div>
        </div>
    -->
      

    
  {:else}
  <p>Did not find any user with the given id</p>
  {/if}
  {/if}

  
{:else}
<p>Can not show user if not logged in to an account</p>
{/if}

</body>


  

<style>


body {
        font-family: Arial, sans-serif;
      }
      #profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 50px auto;
        width: 80%;
        max-width: 800px;
      }
      h1 {
        font-size: 36px;
        margin-bottom: 10px;
        color: white;
        padding: 10px 30px 30px 30px;
      }
      .follow-button {
        padding: 10px 30px;
        border-radius: 20px;
        background-color: #00bfff;
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .follow-button:hover {
        background-color: #1e90ff;
      }
      .follow-button.following {
        background-color: #808080;
      }
      .wish-list {
        overflow-y: scroll;
        max-height: 400px;
        margin-top: 20px;
      }
      .wish-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
      }
      .wish-item.done {
        background-color: #5c995c;
      }
      .wish-item .wish-title {
        flex-grow: 1;
        margin-right: 10px;
        font-weight: bold;
        cursor: pointer;
        color: white
      }
      .wish-item .done-checkbox {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .wish-item .done-checkbox.done {
        background-color: #2b423a;
        color: white;
        border-color: #ffffff;
      }
    /*.pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    .pagination > button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 10px;
    }
    .pagination > button:last-child {
      margin-right: 0;
    }*/

  .test{
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .mainGrid{
    display: grid;
    grid-template-columns: 2fr 2fr;
    border-radius: 10px;
  }

  .leftColumn{
    text-align: center;
    margin-left: 70px;
    margin-top: 10%;
  }

  .title{
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
    /*margin: 30px 0;*/
  }

  .leftColumn {
    text-align: center;
    max-width: 450px;
  }

  .followButton {
    align-items: center;
  }

  #increasedItem {
    padding-bottom: 15px;
    background-color: rgb(255, 255, 255);
    padding-top: 1%;
  }

  #itemTitle {
    text-align: center;
  }

  #buyer {
    text-align: start;
  }

  :global(body) {
    
    background-color:rgb(255, 255, 255);
    justify-content: center;
    flex-direction: column;

    
    
  }

  .wishList {
    padding: 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: rgb(151, 191, 235);
  }
  
  #itemTitle{
    text-align: start;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .item{
    border-radius: 5px;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    background-color: rgb(255, 255, 255);
    margin-top: 15px;
  }

  .item-btn{
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .item-btn i {
    font-size: 18px;
  }

  #profilePic{
    max-width: 100%;
    max-height: 100%;
    width: 350px;  
    height: auto; 
    object-fit: cover;
    margin-top: 80px;
    border-radius: 10px; 
  }

  #wishListObject{
    text-align: center;
    margin: 50px;
    max-width: 450px;
  }


</style>
