export const SignUpAPI = 'http://localhost:5000/api/users';

export const SignInApi = 'http://localhost:5000/api/users/login';

export const CreateDataApi =
  'https://aerothonbackend-production.up.railway.app/api/fabrication';
export const baseLocalApi = 'http://localhost:5000/api';

export const baseApi = 'http://localhost:5000';

export const validateFormData = (formData) => {
  console.log(formData);
  const allowedStartDigit = ['9', '8', '7', '6'];
  if (!(formData.mobile.length === 10 || formData.mobile.length === 13)) {
    return false;
  }
  let startIndex = 0;
  if (formData.mobile.substr(0, 3) === '+91') {
    startIndex = 3;
  }
  if (!allowedStartDigit.includes(formData.mobile[startIndex])) {
    return false;
  }
  for (let i = startIndex; i < formData.mobile.length; i += 1) {
    if (formData.mobile[i] < '0' || formData.mobile[i] > '9') {
      return false;
    }
  }
  return true;
};
