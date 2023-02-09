<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css
">
<script>
    import { text } from "svelte/internal";

   

    
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
  
  document.addEventListener ("DOMContentLoaded", function() {

    // ------------------- following button -------------
    var follow = false
    /*document.getElementById("follow").addEventListener("click", ToggleFollow)
    
    function ToggleFollow() {
      
      var followOrNot = document.getElementById("follow")
      
      if (follow){
        followOrNot.innerHTML = "Following ✔️"
        follow = false
      } else {
        followOrNot.innerHTML = "✚ Follow"
        follow = true
      }

    }*/
    //<img id="profilePic" src="https://preview.redd.it/v0caqchbtn741.jpg?auto=webp&s=c5d05662a039c031f50032e22a7c77dfcf1bfddc" alt="">
  
    
  
  })

</script>

<!------------ HTML code ----------->

<body>

     <div id="wishListObject">
      <h1 class="title">
        User Name's Wish List
      </h1>

      <div class="wishList">
        {#each arrayOfWishes as wish}
        <div class="item">

          <div class="item-btn">
            <!-- dessa if satser är inte de snygaste men får duga för frontend sålänge -->
            {#if wish.purchased}
              <i class="fa-regular fa-square-check"></i>
            {:else}
              <i class="fa-regular fa-square"></i>
            {/if}
            
          </div>
          
          <p id="itemTitle">{wish.itemName}</p>

          {#if wish.purchased}
          <div class="item-btn">
            
          
          <i id="closed" class="fa-solid fa-chevron-down"></i>
          <!--<i class="fa-solid fa-xmark"></i>-->
          
            
            
          </div>
          <span></span>
          <div id="increasedItem">
            <div id="buyer">Bought by: {wish.purchased}</div>
          </div>
          {/if}

        </div>
        


        <!-- increased item view -->
       
        {/each}
        

      </div>
    </div>
</body>
  

<style>

  .title{
    text-align: center;
  }


  #increasedItem {
    padding-bottom: 15px;
    background-color: brown;
    padding-top: 1%;

    
  }

  #itemTitle {
    text-align: center;
  }

  #buyer {
    text-align: start;
  }


  body {
    background-color: aqua;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }

  .wishList {
    width: 450px;
    padding: 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: blanchedalmond;

  }

  .title {
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
    margin: 30px 0;
    text-align: center;
  }

  .wishList{
    width: 100%;
    margin-top: 30px;
  }
  
  #itemTitle{
    text-align: start;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .item{
    border-radius: 5px;
    box-shadow: 1 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    background-color: brown;
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

  #grid{
    display: grid;
    grid-template-columns: 2fr 2fr;
    grid-template-rows: 2fr 2fr;
  }

  #userNameAndFollow{
    text-align: center;
    max-width: 100%;
    max-height: 100%;
    display: block
  }

  #profilePic{
    text-align: center;
    margin-top: 4%;
    margin-left: 4%;
    max-width: 100%;
    max-height: 100%;
    display: block
  }

  #wishListObject{
    text-align: center;
    margin-top: 40px;
  }

  #wishList{
    text-align: center;
    margin-left: 8%;
    margin-right: 8%;
    margin-top: 3%;
    max-width: 100%;
    max-height: 100%;
    display: block
  }
 
  #profilePic {
    border-radius: 10%;
  }

</style>
