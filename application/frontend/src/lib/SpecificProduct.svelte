
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

   class Product {
          constructor(itemName, purchased) {
              this.itemName = itemName;
              this.purchased = purchased;
          }
      }
  
    var arrayOfWishes = []
  
    arrayOfWishes.push(new Product("A horse", "Ricky229")) 
    arrayOfWishes.push(new Product("5000 $", ""))
    arrayOfWishes.push(new Product("Food", "")) 
    arrayOfWishes.push(new Product("A new iPhone", "user_2883"))
  
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

  <div class="mainGrid">

    <div class="leftColumn">
      <div class="test">
        <img id="profilePic" src="https://preview.redd.it/v0caqchbtn741.jpg?auto=webp&s=c5d05662a039c031f50032e22a7c77dfcf1bfddc" alt="">
      </div>
      <div class="test">
        <p>specific product</p>
      </div>
      
      <!-- if not following -->
      <button class="followButton"><i class="fa-solid fa-plus"></i> Follow </button>
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

<style>

  .test{
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .mainGrid{
    display: grid;
    grid-template-columns: 2fr 2fr;
    background-color: aqua;
    border-radius: 10px;
  }

  .leftColumn{
    text-align: center;
    margin-left: 50px;
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
    /*background-color: brown;*/
    padding-top: 1%;
  }

  #itemTitle {
    text-align: center;
  }

  #buyer {
    text-align: start;
  }

  :global(body) {
    justify-content: center;
    flex-direction: column;
  }

  .wishList {
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
