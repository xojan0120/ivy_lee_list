// ----------------------------------------------------------------------------------------
// * Constants
// ----------------------------------------------------------------------------------------
export const cmnPreloaderSize  = 21; 
export const cmnSeparatorId    =  1; // DB上のidと同値にする 
export const cmnApiEndPointUri =  process.env.REACT_APP_API_ENDPOINT_URI;

// ----------------------------------------------------------------------------------------
// * Methods
// ----------------------------------------------------------------------------------------
export const cmnFailureCallBack = (error) => {
  alert(error);
}

// componentDidMount内で使用する
export const cmnSetGtag = () => {
  console.log(process.env.REACT_APP_GOOGLE_TRACKING_ID);
  if (process.env.REACT_APP_GOOGLE_TRACKING_ID) {
    let script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=" + process.env.REACT_APP_GOOGLE_TRACKING_ID;

    let script2 = document.createElement("script");
    script2.innerText = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '" + process.env.REACT_APP_GOOGLE_TRACKING_ID + "');"

    document.head.prepend(script2);
    document.head.prepend(script1);
  }
}
