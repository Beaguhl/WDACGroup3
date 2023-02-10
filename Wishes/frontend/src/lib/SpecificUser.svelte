<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css
">
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
  
  document.addEventListener ("DOMContentLoaded", function() {

    // ------------------- following button, som laggar -------------
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
  
  })

</script>

<!------------ HTML code ----------->

<!-- alla färger är bara tillfälliga för att det ska vara enkelt att se vad som är vad, dom ska ändras sen -->

<body>
  <div class="mainGrid">

    <div class="leftColumn">
      <img id="profilePic" src="https://preview.redd.it/v0caqchbtn741.jpg?auto=webp&s=c5d05662a039c031f50032e22a7c77dfcf1bfddc" alt="">
      <p>user name</p>
      <!-- if not following -->
      <button><i class="fa-solid fa-plus"></i> Follow </button>
      <!-- if following -->
      <!-- <button>Following <i class="fa-solid fa-check"></i></button> -->
    </div>

    <!-- hela högra columnen -->
    <div id="wishListObject">
      <p class="title">
        User Name's Wish List
      </p>
      
      <!-- lista med wishes -->
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

          <!-- om en item är köpt ska en knapp komma upp, annars inte -->
          {#if wish.purchased}
            <div class="item-btn">
              <i id="closed" class="fa-solid fa-chevron-down"></i>
              <!--<i class="fa-solid fa-xmark"></i>   when increased item view is open it should have this symbol instead of chevron-down -->
            </div>
            <span></span>

            <!-- increased item view -->
            <div id="increasedItem">
              <div id="buyer">Bought by: {wish.purchased}</div>
            </div>

          {/if}
        </div>
        {/each}

      </div>
    </div>
  </div>
</body>

<style>

  .mainGrid{
    display: grid;
    grid-template-columns: 2fr 2fr;
    /*flex-direction: row;
    flex-wrap: wrap;*/
    grid-gap: 120px;
    background-color: aqua;
    border-radius:6%;
   
  }

  .leftColumn{
    text-align: center;
  }

  .title{
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
    /*margin: 30px 0;*/
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
    display: flex;
    align-items: center;
    background-color:coral;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    
  }

  .wishList {
    /*width: 450px;*/
    padding: 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: blanchedalmond;
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

  #profilePic{
    text-align: center;
    max-width: 100%;
    max-height: 100%;
    display: block;
    width: 350px;  
    height: auto; 
    object-fit: cover;
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 80px;    
  }

  #wishListObject{
    text-align: center;
    object-fit: cover;
    margin: 50px;
  }

  #profilePic {
    border-radius: 10%;
  }

</style>
