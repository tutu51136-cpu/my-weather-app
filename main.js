document.addEventListener('DOMContentLoaded', () => {

    const navMenu = document.getElementsByClassName('nav-menu')[0];
    const menuBTN = document.getElementsByClassName('humber-btn')[0];
    const btn = document.querySelectorAll('.text-home');
    const confirm_btn = document.getElementById('con-btn');
    const cityName = document.getElementById('input');
    const searchBTN = document.getElementById('city-search');
    const suggestionBox = document.getElementById('suggestion-list-box');
    const cityResponse = document.getElementById('city-response');
    
    let isWaitting = false;// အခြေအနေပြ variable 

    // --- Global လှမ်းသုံးမယ့် Function ---
    const getSuggestionList = () => document.querySelector('.suggestion-list')?.classList;
    
   



    // 1. Nav Menu Toggle
    
    try {
        //.menu-btn နိုပ်ရင် nav-menu ပေါ်လာအောင်
        menuBTN.addEventListener('click', () => {
            navMenu.classList.toggle('active-nav-menu');
            
            //.nav-menu ပေါ်လာရင် အနောက်က contentတွေနိုပ်လို့မရအောင်
            navMenu.classList.toggle('overlay-active'); 
        });
    } catch (err) { console.warn("Menu button မရှိပါ"); }

    //special characters ပါရင်ဖျက်ထုတ်မယ်
    cityName.addEventListener('input',(e) => {  
    
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
     });
    

    // 2. Select Effect
    btn.forEach((bt) => {
    
        // .text-home မှာတစ်ခါနိုပ်တိုင်း active class name တစ်ခုပဲရှိနေအောင်
        bt.addEventListener('click', () => {
        
            // .text-homeမှာ activeပါမပါ loopပတ်ပြီးစစ်မယ် 
            btn.forEach(
            
            //active ပါလာခဲ့ရင် remote မယ်
            b => b.classList.remove('active')
            );
            
            //.text-home မှာ active မရှိရင် addမယ်
            bt.classList.add('active');
        });
    });




    // 3. Page Change Logic
    if (confirm_btn) {
        confirm_btn.addEventListener('click', () => {
            
            // index ကို 0ကနေစတင်အောင်
            let selectedIndex = -1;
            
            // .text-home ကိုloopနဲ့ပတ်မယ်
            btn.forEach((bt, index) => {
            
                // .text-home ရဲ့class name မာactive ပါလာရင် selectedIndex ကို.text-home indexပေးမယ်
                if (bt.classList.contains('active')) selectedIndex = index;
            });
            
            // selectedIndex ရဲ့ index နဲ့တူအောင်
            const pages = ["../Home%20Page.html", "../About%20Page.html", "../Content%20Page.html"];
            
            // page index နဲ့ selectedIndex ရဲ့ index တူနေတာမို့ အစီအစဉ်အတိုင်းသွားမယ်
            if (pages[selectedIndex]) {
                window.location.href = pages[selectedIndex];
            }
        });
    }



    // 4. API & Suggestion Logic
    //searchBTN နိုပ်ရင်အထဲကုဒ်တွေကို runမယ့်သူ
    searchBTN.addEventListener('click', async () => {
    
        //user spaceထည့်ပြီးရိုက်ရင် space တွေကိုဖျက်မယ်
        const query = cityName.value.trim();
        
        //အရင်ဆုံး tag အဟောင်း ရှိရင်ဖျက်မယ်
        suggestionBox.textContent = null;
        
       //p tag အသစ်ဖန်တီးမယ်
        const pTag = document.createElement('p');
        
        //p tag id ပေးမယ်
        pTag.id = 'suggestionContent';
        
        //Box မှာp tagကိုထည့်မယ်
        suggestionBox.appendChild(pTag);
        
        //p tagကိုid နဲ့ပြန်ပြီဖမ်းမယ်
        const suggestionContent = document.getElementById('suggestionContent');
        
        
        // တံခါးပိတ်နေတာ သို့မဟုတ် query.length 2လုံးအောက် ရောက်နေရင်  severဆီသွားတာကို ရပ်ခိုင်းမယ်
        if (isWaitting || query.length < 2) {
            suggestionBox.textContent = null;
            return;
        }

        isWaitting = true; //sever ဆီ‌ေဒတာသွားယူပြီမို့ တံခါးပိတ်မယ်
        
        //severကိုdataသွားယူနေချိန် အလုပ်လုပ်မဲ့ကုဒ်
        suggestionContent.textContent = 'ရှာဖွေနေပါသည်...';

        try {
            //severဆီဒေတာ သွားယူမဲ့ကုဒ်
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=20&appid=${apiKey}`);
            
            // ဒေတာရရင် json ပြောင်းမယ်
            const data = await response.json();
            
            //severက dataရရင် tag အဟောင်းတွေကို ရှင်းထုတ်မယ်
            suggestionBox.textContent = null;
            
            
            //ရလာတဲ့ဒေတာကို Array ဟုတ်မဟုတ်စစ်မယ်
            if (Array.isArray(data)) {
                //Array မှန်တယ်ဆို data ကိုloop ပတ်ပြီး suggestion box မှာပြမယ်
                data.forEach(city => {
                
                    //div အသစ်ဖန်တီးမယ်
                    const div = document.createElement('div');
                    
                    //div အသစ်ကို class ပေးမယ်
                    div.classList.add('suggestion-list'); 
                    
                    //divထဲကို severက dataတွေထုတ်ပြီးထည့်မယ်
                    div.textContent = `${city.name}, ${city.country}`;
                    
                    //div ကိုResult Boxမှာသွားပြမယ်
                    suggestionBox.appendChild(div);
                });
            }
            
            
            
            //sever ကပေးတဲ့ data မရှိရင်
            if(data.length === 0){
                // dTag အသစ်တစ်ခု ဖန်တီးမယ်
                const dTag = document.createElement('p')
                
                //dTag ကိုidပေးမယ်
                dTag.id = 'suggestionContent-d';
                
                //Boxမှာ dtagပြန်ထည့်မယ်                
                suggestionBox.appendChild(dTag);
                
                //dTag Content ပြမယ်
                dTag.textContent = "dataမရှိပါ";
            }
            
           
        } catch (err) { //error တက်ခဲ့ရင် ပြမဲ့ကုဒ်
            console.warn("Error: " + err);
        } finally {
            isWaitting = false; //အလုပ်တွေပြီးရင် တံခါးပြန်ဖွင့်မယ်
        }
    });




    //5. .suggestion-box ကdivတစ်ခုခုနိုပ်တဲ့အခါ နိုပ်လိုက်တဲ့ မြို့နာမည်ရဲ့အချက်အလက်ကို အသေးစိတ်ဖော်ပြခြင်း
    suggestionBox.addEventListener('click',async (e) => {
        
        //နိုပ်လိုက်တဲ့ ဟာကdivဟုတ်မဟုတ်စစ်မယ်
        if(e.target.classList.contains('suggestion-list')){
        
            //နိုပ်လိုက်တဲ့ဟာရဲ့ city name နဲ့ country nameကိုယူမယ်
           const suggestionName = e.target.textContent;
            
            //Function ကိုလှမ်းဖမ်းပြီး variable တစ်ခုအနေနဲ့သိမ်းမယ်
            const allClasses = getSuggestionList();
            
            //ရွေးပြီးရင် list ကိုပြန်ဖျက်မယ်
            suggestionBox.textContent = ' ';
            
            //div နိုပ်ရင်city-response display block ပြောင်းမယ်
            cityResponse.classList.add('active');
            
            //အရင်ဆုံး cityResponse pageကို nullထားမယ်
            cityResponse.textContent = null;
            
            const cityNameOnly = suggestionName.split(',')[0].trim();
            try{
                
                //sever ကနေ‌dataသွားယူမယ်
                const responses = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityNameOnly)}&units=metric&appid=${apiKey}`)
              if(!responses.ok){
                  console.log('err')
              }
                //ဒေတာရရင် json ပြောင်းမယ်
                const data = await responses.json();
                
                //div အသစ်တစ်ခု ဖန်တီးမယ်
                const headCity = document.createElement('div');
                
                //headCityကို class name ပေးမယ်
                headCity.classList.add('city-head');
                
                //headCityရဲ့ contentကို suggestionNameပေးမယ်
                headCity.textContent = "---------- " + suggestionName + " ----------";
                
                //headCityကို cityResponseမှာ ထည့်မယ်
                cityResponse.appendChild(headCity);
                
                //severက data ရခဲ့ရင်
               if(data.wind){
                    try{
                     
                        //dataထဲ mainပါခဲ့ရင်
                        if(data && data.main){
                        
                            // tempDivဖန်တီးမယ်
                            const tempDiv = document.createElement('div');
                            
                            //tempDivကို class name ပေးမယ်
                            tempDiv.classList.add('temp-div');
                            
                            // dataထဲက အပူချိန်ကိုယူပြီး currentTemp variable တစ်ခုအနေသိမ်းမယ်
                            const currentTemp = data.main.temp;
                            
                            // currentTempကို tempDivမှာ content များနဲ့ပေါင်းပြီးထည့်မယ်
                            tempDiv.textContent = "Temperature : " + currentTemp + "C°";
                           
                           //tempDivကို cityResponse ထဲထည့်ပြီး ပြမယ်
                            cityResponse.appendChild(tempDiv);
                        }
                
                        //dataထဲမာ windပါလာရင်
                        if(data.wind){
                        
                        //windDivကို divတစ်ခုအနေနဲ့ ဖန်တီးမယ်
                        const windDiv = document.createElement('div');
                        
                        //windDivကို class name temp-div ပေးမယ်
                        windDiv.classList.add('temp-div');
                        
                        //dataထဲက လေတိုက်နှုန်းကို ဆွဲထုတ်ပြီး currentWind variable တစ်ခုအနေနဲ့ သိမ်းမယ်
                        const currentWind = data.wind.speed;
                        
                        //currentWindကို windDivထဲမှာ content များနဲ့တွဲထည့်မယ်
                        windDiv.textContent = "Wind speed : " + currentWind + "m/s";
                        
                        //windDivကို cityResponseထဲမှာ ထည့်မယ်
                        cityResponse.appendChild(windDiv);
                        }
                        
                        //data.main ရှိခဲ့ရင်
                        if(data.main){
                        
                            //divအသစ်တစ်ခု ဖန်တီးမယ်
                            const humidity = document.createElement('div');
                           
                           //class name temp-div ပေးမယ်
                            humidity.classList.add('temp-div');
                            
                            //dataထဲက humidity ကိုယူမယ်
                            const currentHum = data.main.humidity;
                            
                            //humidity ကိုစာသားနဲ့ဖော်ပြမယ်
                            humidity.textContent = "Humidity : " + currentHum + "m/s";
                           
                           //cityResponseထဲမှာ humidityကိုထည့်မယ်
                            cityResponse.appendChild(humidity)
                           
                        }
                        
                        if(data.weather){
                           
                            const descDiv = document.createElement('div');
                            
                            const stats = data.weather[0].description;
                            descDiv.textContent = "Situation : " + stats;
                            descDiv.classList.add('temp-div');
                          cityResponse.appendChild(descDiv);
                            
                        }
                        
                        if(data.main){
                            const feelLike = data.main.feels_like;
                            const descDiv = document.createElement('div');
                            descDiv.classList.add('temp-div');
                            descDiv.textContent = "Feel Like Temperature : " + feelLike + "C°" ;
                            
                            cityResponse.appendChild(descDiv);
                        }
                    }catch(err){
                        console.log(err);
                    }
               }else{
                   alert("severနှင့် error တက်နေသည်။")          
               }
                
                
            }catch(err){
            console.log("Error" + err)
            }
        }
        
    });  
    
    //6 inputကို စာလုံးရေကန့်သတ်မယ်
    
    
    
});
