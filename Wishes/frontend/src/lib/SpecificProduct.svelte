
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

   class Information {
          constructor(itemName, itemPrice, itemImage, itemShortDescription, itemInWishList) {
              this.itemName = itemName
              this.itemPrice = itemPrice
              this.itemImage = itemImage
              this.itemShortDescription = itemShortDescription
              this.itemInWishList = itemInWishList
          }
      }
  
    var productDescription
  
    productDescription = new Information(
      "Horse", 
      500, 
      "https://www.fauna-flora.org/app/uploads/2017/09/rhino_shutterstock_60362779-scaled-e1655220982564.jpg", 
      "It is a unicorn",
      true)
   
  
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
    <h1 class="title">
      {productDescription.itemName}
    </h1>
    <div class="test">
      <img id="profilePic" src="{productDescription.itemImage}" alt="">
    </div>
    <p>
      {productDescription.itemShortDescription}
    </p>
    <p>
      ${productDescription.itemPrice}
    </p>
    <div class="test">
    </div>
    <!-- lista med wishes -->
    <div class="wishList">
      

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

  #profilePic{
    max-width: 100%;
    max-height: 100%;
    width: 350px;  
    height: auto; 
    object-fit: cover;
    margin-top: 80px;
    border-radius: 10px; 
  }
  
</style>
