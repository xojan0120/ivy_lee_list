// ----------------------------------------------------------------------------------------
// * Constants
// ----------------------------------------------------------------------------------------
export const cmnPreloaderSize  = 21; 
export const cmnSeparatorId    =  1; // DB上のidと同値にする 
export const cmnApiEndPointUri =  'http://192.168.11.7:3001/api/v1/ill';
//export const cmnApiEndPointUri =  'http://ec2-52-68-68-224.ap-northeast-1.compute.amazonaws.com/api/v1/ill';

// ----------------------------------------------------------------------------------------
// * Methods
// ----------------------------------------------------------------------------------------
export const cmnFailureCallBack = (error) => {
  alert(error);
}
