// const Apikey=vk_prod_bb15a394311196053446d47a



// This feature is in development.
export const validateEmail = async (email) => {


  const response = await fetch("https://api.validkit.com/api/v1/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-API-Key": "vk_prod_bb15a394311196053446d47a",
    },
    body:JSON.stringify({
        email:email,
        debug:false
    })
  }).then(async (res)=>{
    return await res.json()
  })

  response.sucess
};












