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
