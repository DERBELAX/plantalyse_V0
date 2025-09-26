const mockAxios = {
  __esModule: true,      
  default: {},             
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};


mockAxios.default.get = mockAxios.get;
mockAxios.default.post = mockAxios.post;
mockAxios.default.put = mockAxios.put;
mockAxios.default.delete = mockAxios.delete;

module.exports = mockAxios;
