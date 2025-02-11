import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { AuthFormType } from 'types/authForm';
import AuthForm from 'components/forms/authForm';
import clsx from 'clsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: AuthFormType;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialTab = AuthFormType.LOGIN
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Tab.Group
                  selectedIndex={activeTab === AuthFormType.LOGIN ? 0 : 1}
                  onChange={(index) =>
                    setActiveTab(index === 0 ? AuthFormType.LOGIN : AuthFormType.SIGNUP)
                  }
                >
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                    {['Login', 'Sign Up'].map((tab, index) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          clsx(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                            'transition-all duration-500 ease-in-out',
                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            selected
                              ? 'scale-100 transform bg-white text-black shadow'
                              : 'scale-95 text-gray-600 hover:bg-white/[0.12] hover:text-black'
                          )
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                  </Tab.List>

                  <div className="relative mt-6">
                    <div className="relative overflow-hidden">
                      <Tab.Panels>
                        <Tab.Panel
                          className={clsx(
                            'absolute w-full transform transition-all duration-500 ease-in-out',
                            activeTab === AuthFormType.LOGIN
                              ? 'relative translate-x-0 opacity-100'
                              : 'translate-x-full opacity-0'
                          )}
                        >
                          <AuthForm formType={AuthFormType.LOGIN} />
                        </Tab.Panel>

                        <Tab.Panel
                          className={clsx(
                            'absolute w-full transform transition-all duration-500 ease-in-out',
                            activeTab === AuthFormType.SIGNUP
                              ? 'relative translate-x-0 opacity-100'
                              : '-translate-x-full opacity-0'
                          )}
                        >
                          <AuthForm formType={AuthFormType.SIGNUP} />
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </div>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
