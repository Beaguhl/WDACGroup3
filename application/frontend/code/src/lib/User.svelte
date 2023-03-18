
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

    

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
  let user = null

  async function loadUser(){
    try {
      const response = await fetch("http://localhost:8080/user/" + id)
      
      switch(response.status) {
        
        case 200:
          isFetchingUser = false
          user = await response.json()
          console.log(user)
          break
        
        case 404:
          isFetchingUser = false

      }

    } catch (error) {
      failedToFetchUser = true
      failedToFetchUser = true
    }
  }
  
  loadUser()

</script>

<!------------ HTML code ----------->

{#if isFetchingUser}
  <p>Wait, fetching data...</p>
{:else if failedToFetchUser}
  <p>Couldn't fetch user. Check your Internet connection.</p>
{:else if user}
  {#each user as singleUser}
    <div class="mainGrid">
        <div class="leftColumn">
          <div class="test">
            <p>{singleUser.username}</p>

          </div>
          
          <!-- if not following -->
          <button class="followButton"><i class="fa-solid fa-plus"></i> Follow </button>
          <!-- if following -->
          <!-- <button>Following <i class="fa-solid fa-check"></i></button> -->
        </div>

        <!-- hela högra columnen -->
        <div id="wishListObject">
          <p class="title">
            {singleUser.username}'s Wish List
          </p>
          
          <!-- lista med wishes -->
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
  {/each}
  
{:else}
<p>Did not find any user with the given id</p>
{/if}
  

<style>

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
