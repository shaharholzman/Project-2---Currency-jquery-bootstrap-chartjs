let arr_names=[]
let arr_symbol=[]
let arr_target_symbol = []
let switchStatus = false;

$(function(){

// by reload------------->
load()

// go to canvas.js--------->
$('.btn_my1').click(liveReportCards)

// go to about------------->
$('.btn_my2').click(about)
   
// return to coin page------>
$('.btn_my').click(return_to_coin)
   
// change to on for toggle button------------------------------------------------->
function return_toggle_button(){
  if(localStorage.getItem("liveReportCards")==null){
    localStorage.setItem("liveReportCards",JSON.stringify(arr_names))
  } else{
    let check_who_is_on = localStorage.getItem("liveReportCards",arr_names)
    let check_who_is_on_json = JSON.parse(check_who_is_on)
    for(i=0; i < check_who_is_on_json.length ;i++){
      console.log(check_who_is_on_json[i]);
      $(`#${check_who_is_on_json[i]}`).prop(`checked`,true)
    }
  }
}

// refresh by botton coin--------------------------------------------------------->
function return_to_coin(){
  $('.btn_my1').removeClass('btn-warning')
  $('.btn_my1').addClass('btn-outline-warning')
  $('.btn_my2').removeClass('btn-success')
  $('.btn_my2').addClass('btn-outline-success')
  $('.btn_my').removeClass('btn-outline-danger')
  $('.btn_my').addClass('btn-danger')
  $('.Sbox').empty()
  $('.Sbox').append(` 
  <div class="lds-spinner my_spiner col-xl-6 col-md-6 col-12">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
`)

  load()
}

// on load/append all coins------------------------------------------------------->
function load(){
  
  $.get('https://api.coingecko.com/api/v3/coins/list',coins =>{
    $('.my_spiner').fadeOut()
    console.log(arr_coins=coins);
    for (i=0;i<100;i++){
      
      $('.Sbox').append(`
      <div class="append_this_${arr_coins[i].symbol} col-xl-3 col-md-3 col-10 card-body" id ="${arr_coins[i].symbol} ${arr_coins[i].name} card_num_${i}">
      <h5 class="card-title  col-xl-9 col-md-7 col-9">${arr_coins[i].symbol}</h5>
      <label class="switch">
      <input type="checkbox" value = "false" class="input_toggle ${arr_coins[i].symbol}" id="${arr_coins[i].symbol}">
      <span class="slider round toggle_class" ></span>
      </label>       
      <h6 class="card-subtitle mb-2 text-muted">${arr_coins[i].name}</h6>
      <div class="more_info_${arr_coins[i].id}  toggle btn btn-primary" id ="${arr_coins[i].id}">
      <i class="fas fa-info"></i>
      More Info</div>
      <div class = "new_info" id = "div${arr_coins[i].id}">
      <img class = "img_info" id="img${arr_coins[i].id}" src="" alt="">
      <div class = "box_info">
      <p class = "span_info1" id="span1${arr_coins[i].id}"> </p>
      <p class = "span_info2" id="span2${arr_coins[i].id}"></p>
      <p class = "span_info3" id="span3${arr_coins[i].id}"> </p>
      </div>
      </div>
      </div>
      `)
      $('.Sbox').hide()
      $(`#div${arr_coins[i].id}`).hide()
      $('.Sbox').fadeIn()
      arr_target_symbol.push(`${arr_coins[i].symbol}`)
    }
    return_toggle_button()
    $('.toggle').click(moreInfo_toggle)
    $(".input_toggle").on('change', change_toggle)   
    $('.btn_my3').click(search)
})
}
      
// הצגת מטבעה ספציפי--------------------------------------------------------->
function search(){
    let input_value = document.getElementById('inp').value
    console.log(symbol=input_value);
    let num_in_array = arr_target_symbol.indexOf(symbol)
    console.log(num_in_array)
    if(num_in_array < 0){
      alert("The value you entered does not match to any currency, please try again")
    }else{
      $('.card-body').hide()
      $(`.append_this_${symbol}`).fadeIn()
    }
}

// display info fo each coin/more info------------------------------------------->
function moreInfo_toggle(e){
          console.log( ID = e.target.id);
          e.stopPropagation()
          console.log(ID);
          if(localStorage.getItem(ID) == null ) {
            console.log("no local, take api and save");
            $(`.more_info_${ID}`).append(`
            <div class="spinner-grow text-info" id="my_spiner_small" role="status">
            <span class="sr-only">Loading...</span>
            </div>
            `)
            $.get(`https://api.coingecko.com/api/v3/coins/${ID}`,info =>{
              $('#my_spiner_small').remove()
              console.log(courect_obj = info);
              $(`#div${courect_obj.id}`).slideToggle(()=>{
              $(`#img${ID}`).attr(`src`, `${courect_obj.image.large}`)
              $(`#span1${ID}`).text(`USD :  ${courect_obj.market_data.current_price.usd}$`)
              $(`#span2${ID}`).text(`EUR :  ${courect_obj.market_data.current_price.eur}€`)
              $(`#span3${ID}`).text(`ILS :  ${courect_obj.market_data.current_price.ils}₪`)
              console.log("save in local");
              let time = new Date().getTime()
              time /= 1000
              console.log(time);
              let arr_local = [`${courect_obj.image.large}`,`USD :  ${courect_obj.market_data.current_price.usd}$`,`EUR :  ${courect_obj.market_data.current_price.eur}€`,`ILS :  ${courect_obj.market_data.current_price.ils}₪`,time]               
              localStorage.setItem(ID,JSON.stringify(arr_local))
               })
               })

          }else if (localStorage.getItem(ID)!= null){
              console.log("there is a local storge");
              let arr_local_new = localStorage.getItem(ID)
              let arr_local_new_parse = JSON.parse(arr_local_new)
              console.log(time_local = arr_local_new_parse[4]);
              let curr_time = new Date().getTime()
              curr_time /= 1000
              console.log("cuurtime is"+" "+ curr_time);
          if(curr_time - time_local < 120){
              console.log(curr_time - time_local);
              $(`#div${ID}`).slideToggle(()=>{
              console.log("take from local storge");
              let arr_local = localStorage.getItem(ID)
              console.log(arr_local);
              let arr_new = JSON.parse(arr_local)
              $(`#img${ID}`).attr(`src`, `${arr_new[0]}`)
              $(`#span1${ID}`).text(`${arr_new[1]}`)
              $(`#span2${ID}`).text(`${arr_new[2]}`)
              $(`#span3${ID}`).text(`${arr_new[3]}`)
              })

          }else{
             console.log("yas local take api");
             $(`.more_info_${ID}`).append(`
             <div class="spinner-grow text-info" id="my_spiner_small" role="status">
             <span class="sr-only">Loading...</span>
             </div>
              `)
             $.get(`https://api.coingecko.com/api/v3/coins/${ID}`,info =>{
             $('#my_spiner_small').remove()
             $(`#div${ID}`).slideToggle(()=>{
             console.log(courect_obj = info);
             $(`#img${ID}`).attr(`src`, `${courect_obj.image.large}`)
             $(`#span1${ID}`).text(`USD :  ${courect_obj.market_data.current_price.usd}$`)
             $(`#span2${ID}`).text(`EUR :  ${courect_obj.market_data.current_price.eur}€`)
             $(`#span3${ID}`).text(`ILS :  ${courect_obj.market_data.current_price.ils}₪`)        
             console.log("save in local");
             let time = new Date().getTime()
             time /= 1000
             console.log(time);
             let arr_local = [`${courect_obj.image.large}`,`USD :  ${courect_obj.market_data.current_price.usd}$`,`EUR :  ${courect_obj.market_data.current_price.eur}€`,`ILS :  ${courect_obj.market_data.current_price.ils}₪`,time]               
             localStorage.setItem(ID,JSON.stringify(arr_local))
              })
             })
          }
        }
}       

// change coin and toggle botton-------------------------------------------------->
function change_toggle(e){
  let localStorageRetrive = localStorage.getItem("liveReportCards");
  console.log(arr_local_names=JSON.parse(localStorageRetrive));

    if ($(this).is(':checked') && arr_local_names.length < 5) {
      console.log(this)
        switchStatus = $(this).is(':checked');
        console.log(ID = e.target.id);
        console.log("last toggle"+" "+ID);
        e.stopPropagation()

        let new_name = ID;
        console.log(new_name);
        let localStorageRetrive = localStorage.getItem("liveReportCards");
        let localStrageJson = JSON.parse(localStorageRetrive);
        console.log(localStrageJson);
        localStrageJson.push(new_name);
        localStorage.setItem("liveReportCards", JSON.stringify(localStrageJson));
    }

    else if($(this).is(':checked') == false){
      console.log(ID = e.target.id);
      e.stopPropagation()

      let localStorageRetrive = localStorage.getItem("liveReportCards");
      let localStrageJson = JSON.parse(localStorageRetrive);
      console.log(localStrageJson);
      let name_in_array = localStrageJson.indexOf(`${ID}`)
      console.log(name_in_array);
      localStrageJson.splice(` ${name_in_array}`,1);
     localStorage.setItem("liveReportCards", JSON.stringify(localStrageJson));
     
    }else{
      console.log(ID = e.target.id);
      let localStorageRetrive = localStorage.getItem("liveReportCards");
      let localStrageJson = JSON.parse(localStorageRetrive);
      console.log(localStrageJson);
      for(i=0;i<5;i++){
        $('.box_type').append(`
        <h5 class ="title_box col-xl-8 col-md-8 col-7" id="boxTitle_${localStrageJson[i]}">${localStrageJson[i]}</h5>    
        <label class="switch new_switch col-xl-4 col-md-5 col-4" id="boxLabel_${localStrageJson[i]}">
        <input type="checkbox"  class = "togBtn1" id="${localStrageJson[i]}">
        <span class="slider round toggle_class"></span>
        </label>  
        `)
      }
      console.log('apeend all coin to box type');
      $('.box_type').css("z-index","999")
      $('.box_type').css("opacity", "1")
      $('.box_type').fadeIn()
      $('.Sbox').css("opacity","0.3")

// dont switch----------------------
$('.x').click(()=>{
  for(i=0;i<5;i++){
    $('.title_box').remove()
    $('.new_switch').remove()
  }
  $('.box_type').css("z-index","-1")
  $('.box_type').css("opacity", "0")
  $(`#${ID}`).prop(`checked`,false)
  $('.Sbox').css("opacity","1")
})        
}

let chack_change_new = 0
$(".togBtn1").on('change', function (e) {

  if ($(this).is(':checked') && ( chack_change_new < 1)) {
    chack_change_new++
    console.log(chack_change_new);
    switchStatus_new = $(this).is(':checked');
    console.log(remove_ID = e.target.id);
    e.stopPropagation()

    $('.confirm').click(()=>{
      chack_change_new--

      let localStorageRetrive = localStorage.getItem("liveReportCards");
      let localStrageJson = JSON.parse(localStorageRetrive);
      console.log(localStrageJson);
      let name_in_array = localStrageJson.indexOf(`${remove_ID}`)
      console.log(name_in_array);
      console.log("this is the coin go out"+" "+name_in_array);
      console.log("this is the coin go inside"+" "+ID);
      if(name_in_array >= 0){
        localStrageJson.splice(`${name_in_array}`,1,ID);
       localStorage.setItem("liveReportCards", JSON.stringify(localStrageJson));
     
       for(i=0;i<5;i++){
        $('.title_box').remove()
        $('.new_switch').remove()
      }    

        $(`#${remove_ID}`).prop(`checked`,false)
        $('.Sbox').css("opacity","1")
        $('.box_type').css("z-index","-1")
        $('.box_type').css("opacity", "0")

      }else{
        console.log("dont change coins");
      }
    })
    
   } else if($(this).is(':checked') == false){
    console.log(remove_ID = e.target.id);
    console.log(remove_ID);
    chack_change_new--

 } else{
   alert("You can only choose one option, the first option you choose will change")
  }
})
}

// live Report--------------------------------------------------------------------->
function liveReportCards(){
      $('.btn_my').addClass('btn-outline-danger')
      $('.btn_my').removeClass('btn-danger')
      $('.btn_my1').addClass('btn-warning')
      $('.btn_my1').removeClass('btn-outline-warning')
      $('.btn_my2').removeClass('btn-success')
      $('.btn_my2').addClass('btn-outline-success')
      $('.Sbox').empty()
      $('.Sbox').append(` 
      <div class="lds-spinner my_spiner col-xl-6 col-md-6 col-12">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
  </div>
`)
      $('.Sbox').append(`
      <div class="col-xl-10 col-md-10 col-10 canvas"  id="chartContainer" style="height: 400px; width: 90%;margin-left:-2.5%"></div>
      `)
      load_live()

      function load_live(){
        let localStorgeData = localStorage.getItem("liveReportCards")
        let localStorgeDataParse = JSON.parse(localStorgeData)
        console.log( localStorgeDataParse);
    
     let chart = new CanvasJS.Chart("chartContainer", {

        title : {
            text : " Live Report Coins"
        },
          axisY: {
      title: "coin value",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
  },
  legend: {
      cursor:"pointer",
      itemclick: toggleDataSeries
  },

        data:[
        ]
        })
        chart.render()
        
        function toggleDataSeries(e) {
  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
  }
  else {
      e.dataSeries.visible = true;
  }
  chart.render();
}

        for(let i=0;i<localStorgeDataParse.length;i++){
            let linkSymbol = localStorgeDataParse[i].toUpperCase();
            console.log(linkSymbol);
    
            chart.options.data.push({type:"spline",
            name:localStorgeDataParse[i],
            showInLegend : true,
            dataPoints:[]})
    
          let get_data =  setInterval(function()  {


            newDateOp = new Date()

            $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${linkSymbol}&tsyms=USD`,(res)=>{
                $('.my_spiner').fadeOut()
                console.log(res);
                console.log(res.Response);
                if(res.Response === "Error"){
                  console.log(`${linkSymbol} is not found in the api"`);
                }else{
                  chart.options.data[i].dataPoints.push({x:newDateOp,y:res[linkSymbol].USD})
                }
                chart.render()
            })  
            },2000);
            
          
            $('.btn_my').click(()=>{
              clearInterval(get_data)
            })
            $('.btn_my2').click(()=>{
              clearInterval(get_data)
            }) 
        
        }}
    
}

// About page---------------------------------------------------------------------->
function about(){
        $('.btn_my').addClass('btn-outline-danger')
        $('.btn_my').removeClass('btn-danger')
        $('.btn_my1').addClass('btn-outline-warning')
        $('.btn_my1').removeClass('btn-warning')
        $('.btn_my2').addClass('btn-success')
        $('.btn_my2').removeClass('btn-outline-success')
  
      $('.btn_my2')
        $('.Sbox').empty()
        $('.Sbox').append(`
        <div class = "box_about col-xl-10 col-md-10 col-10">
        <h1 class = "title_about">My name is Shahar Holtzman,my age is 25 and lives in Tel Aviv and I Participates in full-stack course</h1>
        <h5 class = "pra_about">This project presents information and value of forex currencies, the data can be viewed in several different ways.</h5>
        <img class=" pic_man" src="" alt="" width = "10%">
        </div>
        `)
        $('.pic_man').attr(`src`, 'pic/men.jpg')
}



});









        
        
        









