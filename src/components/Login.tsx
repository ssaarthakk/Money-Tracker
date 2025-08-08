import SignIn from "./LoginButton"

function Login() {
    return (
        <div className='flex flex-col gap-8 items-center'>
            <h1 className='md:text-5xl text-3xl sm:block flex flex-col gap-1'><span>Welcome </span><span>to </span><span>MoneyTracker</span></h1>
            <SignIn />
        </div>
    )
}

export default Login