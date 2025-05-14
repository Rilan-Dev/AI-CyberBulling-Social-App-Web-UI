export default function AbuTest() {
  return (
    <div className="container h-screen py-8 px-4 bg-gray-200 flex justify-center items-center">
      <div className="h-[400px] w-[400px] rounded-[30px] shadow-xl hover:scale-105 scale-100 duration-500 bg-blue-200/50 p-4 flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold text-gray-800 mb-8">Login</div>
        <div className="flex flex-col w-full">
          <div className="text-sm text-gray-800 ml-2">Username:</div>
          <input
            type="text"
            placeholder="Username"
            className="text-sm border-blue-200 shadow-none text-black bg-white rounded-2xl p-3 mt-2 w-full scale-100 hover:scale-105 duration-500"
          />

          <div className="text-sm text-gray-800  mt-4 ml-2">Password:</div>
          <input
            type="password"
            placeholder="Password"
            className="text-sm border-blue-200 shadow-none bg-white text-black rounded-2xl p-3 mt-2 w-full scale-100 hover:scale-105 duration-500"
          />
        </div>
        <div className="w-full flex justify-end mt-2">
          <div className="text-sm text-gray-800 mb-1 cursor-pointer mr-5">
            Forget Password ?
          </div>
        </div>
        <button className="w-1/2 mt-5 bg-blue-400 text-white rounded-md p-2 hover:bg-blue-400 scale-100 hover:scale-105 duration-500">
          Login
        </button>
      </div>
    </div>
  );
}
