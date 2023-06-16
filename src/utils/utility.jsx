export const SignUpAPI =
  'https://react-chat-app-backend-production.up.railway.app/api/users';

export const SignInApi =
  'https://react-chat-app-backend-production.up.railway.app/api/users/login';

export const CreateDataApi =
  'https://aerothonbackend-production.up.railway.app/api/fabrication';
export const baseLocalApi =
  'https://react-chat-app-backend-production.up.railway.app/api';

export const baseApi =
  'https://react-chat-app-backend-production.up.railway.app';

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
