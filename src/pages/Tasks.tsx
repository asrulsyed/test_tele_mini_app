import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useUser } from "../context/userContext";
import axios from "axios";

const Tasks = () => {
  const [typeTask, setTypeTask] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const { userData, setUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<Window | null>(null);

  const twitterFollow = () => {
    setLoading(true)
    
    const followUrl = `https://twitter.com/intent/follow?user_id=${import.meta.env.VITE_TARGET_USER_ID}`
    const newPopup = window.open(followUrl, 'Follow', 'width=600,height=400')
    if (!newPopup) {
      setLoading(false)
      alert('Please allow popups to follow on Twitter')
      return
    }
    setPopup(newPopup)
  }

  const checkFollowStatus = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/follow`, {
        targetUserId: import.meta.env.VITE_TARGET_USER_ID,
        loggedInUserId: userData?.user_id
      })

      // Handle both 200 and 201 status codes
      if (response.status >= 200 && response.status < 300) {
        setUserData(prev => ({
          ...prev,
          followStatus: true,
        }))
      } else {
        console.error('Follow check failed:', response.data)
      }
    } catch (err) {
      console.error('Follow check error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          checkFollowStatus()
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [popup])

  const twitterLogin = () => {
    try {
      // Open Twitter auth in a popup window
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/twitter`,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup window
      window.addEventListener('message', async (event) => {
        if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

        if (event.data.twitterId) {
          // Update your user context/state with the Twitter data
          // You might want to call an API to update your backend
          setUserData({
            ...userData,
            twitterId: event.data.twitterId,
          });
        }
      }, false);

    } catch (error) {
      console.error('Twitter login error:', error);
    }
  }

  return (
    <main className="w-full min-h-screen bg-bgMain font-aeonik text-[#878787] homeBackground">
      <div className="flex flex-col p-5">
        <div className="flex flex-col gap-6 pt-3 text-left pb-9">
          <h3 className="text-base text-[#FCFCFC] text-medium">Statistics</h3>
          <div className="flex flex-col w-full gap-6 p-3 border border-[#FFFFFF14] bg-[#FFFFFF12] rounded-xl">
            <div className="grid grid-cols-2 gap-[5px]">
              <div className="flex flex-col w-full gap-2 p-3 border border-[#262626] rounded-xl bg-[#010101] justify-between">
                <span className="text-xs">Tasks Completed</span>
                <span className="text-xl font-bold text-[#FFFFFF] leading-none">20</span>
              </div>
              <div className="flex flex-col w-full gap-3 p-3 border border-[#262626] rounded-xl bg-[#010101] justify-between">
                <span className="text-xs">Success Rate</span>
                <span className="text-xl font-bold text-[#FFFFFF] leading-none">100%</span>
              </div>
              <div className="flex flex-col w-full gap-3 p-3 pr-16 border border-[#262626] rounded-xl bg-[#010101] justify-between relative overflow-hidden">
                <span className="text-xs">Total Earned</span>
                <span className="text-xl font-bold text-[#FFFFFF] leading-none">2000</span>
                <img src="/gold-ether.png" className="w-10 h-10 absolute top-1/2 -translate-y-1/2 right-3" />
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-20 h-8 bg-[#FDC818] blur-xl" />
              </div>
              <div className="flex flex-col w-full gap-3 p-3 pr-16 border border-[#262626] rounded-xl bg-[#010101] justify-between relative overflow-hidden">
                <span className="text-xs">Unlockable Points</span>
                <span className="text-xl font-bold text-[#FFFFFF] leading-none">2000</span>
                <img src="/silver-ether.png" className="w-10 h-10 absolute top-1/2 -translate-y-1/2 right-3" />
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-20 h-8 bg-[#FFFFFF] blur-xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-3 mb-20 text-left pb-9">
          <div className="flex items-center justify-between">
            <h3 className="text-base text-[#FFFFFF] text-medium">
              Tasks
            </h3>
            <div className="p-[1px] bg-gradient-to-b from-[#202020] to-[#272727] rounded-full">
              <div className="bg-[#101010] rounded-full p-1 flex items-center justify-between gap-1">
                <button
                  onClick={() => setTypeTask(0)}
                  className="p-[1px] bg-gradient-to-b from-[#202020] to-[#272727] rounded-full w-[96px] h-[31px] flex items-center justify-center border-none focus:outline-none"
                >
                  <div className={`${typeTask === 0 ? 'bg-[#FFFFFF] text-[#010101]' : 'bg-[#FFFFFF1F] text-[#FCFCFC] hover:bg-[#FFFFFF] hover:text-[#010101]'} rounded-full text-base font-medium w-full h-full flex items-center justify-center transition-colors duration-200`}>
                    One-Time
                  </div>
                </button>
                <button
                  onClick={() => setTypeTask(1)}
                  className="p-[1px] bg-gradient-to-b from-[#202020] to-[#272727] rounded-full w-[96px] h-[31px] flex items-center justify-center border-none focus:outline-none"
                >
                  <div className={`${typeTask === 1 ? 'bg-[#FFFFFF] text-[#010101]' : 'bg-[#FFFFFF1F] text-[#FCFCFC] hover:bg-[#FFFFFF] hover:text-[#010101]'} rounded-full text-base font-medium w-full h-full flex items-center justify-center transition-colors duration-200`}>
                    Daily Tasks
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Follow us on Twitter</p>
                  <div className="flex items-center justify-start gap-1">
                    {
                      loading ? (
                        <p className="text-xs text-[#878787] ">Loading...</p>
                      ) : userData?.twitterId && userData.followStatus ? (
                        <>
                          <p className="text-xs text-[#878787] ">Completed</p>
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#07D7C2]"></div>
                        </>
                      ) : (
                        userData?.twitterId ? (
                          <button
                            onClick={twitterFollow}
                            className="w-[54px] h-[23px] bg-[#FFFFFF] rounded-full flex items-center justify-center text-base font-medium text-[#010101] border-none focus:outline-none"
                          >
                            Follow
                          </button>
                        ) :
                          (
                            <button
                              onClick={twitterLogin}
                              className="w-[54px] h-[23px] bg-[#FFFFFF] rounded-full flex items-center justify-center text-base font-medium text-[#010101] border-none focus:outline-none"
                            >
                              Start
                            </button>
                          )
                      )
                    }
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-b from-[#101010] to-[#FFFFFF] via-[#444444] rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-b from-[#101010] to-[#585858] via-[#1b1b1b]">
                    <img src="/points.png" className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-9 h-auto" />
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-[#FFFFFF] text-base ">
                        10
                      </span>
                      <span className="font-medium leading-none text-[#FFFFFF] text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Join Telegram Channel</p>
                  <div className="flex items-center justify-start gap-1">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="w-[54px] h-[23px] bg-[#FFFFFF] rounded-full flex items-center justify-center text-base font-medium text-[#010101] border-none focus:outline-none"
                    >
                      Start
                    </button>
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-b from-[#101010] to-[#F39F3D] via-[#4D361C]  rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-b from-[#101010] to-[#533A1D] via-[#302417]">
                    <img src="/points.png" className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-9 h-auto" />
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-[#F39F3D] text-base ">
                        25
                      </span>
                      <span className="font-medium leading-none text-[#F39F3D] text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Invite First Friend</p>
                  <div className="flex items-center justify-start gap-1">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="w-[54px] h-[23px] bg-[#FFFFFF] rounded-full flex items-center justify-center text-base font-medium text-[#010101] border-none focus:outline-none"
                    >
                      Start
                    </button>
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-b from-[#101010] to-[#FFDF1F] via-[#504814] rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-b from-[#101010] to-[#574D14] via-[#302417]">
                    <img src="/points.png" className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-9 h-auto" />
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-[#FFDF1F] text-base ">
                        50
                      </span>
                      <span className="font-medium leading-none text-[#FFDF1F] text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Complete Your Profile</p>
                  <div className="flex items-center justify-start gap-1">
                    <p className="text-xs text-[#878787] ">Completed</p>
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#07D7C2]"></div>
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-t from-white to-transparent rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-t from-[#585858] to-[#101010]">
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-white text-base ">
                        52
                      </span>
                      <span className="font-medium leading-none text-white text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Follow us on Twitter</p>
                  <div className="flex items-center justify-start gap-1">
                    <p className="text-xs text-[#878787] ">Completed</p>
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#07D7C2]"></div>
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-t from-white to-transparent rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-t from-[#585858] to-[#101010]">
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-white text-base ">
                        52
                      </span>
                      <span className="font-medium leading-none text-white text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#202020] to-[#272727] p-[1px] rounded-[20px]">
              <div className="rounded-[19px] bg-[#101010] px-4 py-4 flex items-stretch justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-[#FFFFFF] text-base font-medium">Follow us on Twitter</p>
                  <div className="flex items-center justify-start gap-1">
                    <p className="text-xs text-[#878787] ">Completed</p>
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#07D7C2]"></div>
                  </div>
                </div>
                <div className="p-[1px] bg-gradient-to-t from-white to-transparent rounded-full">
                  <div className="relative p-6 rounded-full bg-gradient-to-t from-[#585858] to-[#101010]">
                    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <span className="font-bold leading-none text-white text-base ">
                        52
                      </span>
                      <span className="font-medium leading-none text-white text-[11px]">
                        Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <Modal closeModal={() => setIsOpen(false)} />}
    </main>
  );
};

export default Tasks;  