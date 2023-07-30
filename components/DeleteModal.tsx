import React from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

// import { Modal } from '@alfiejones/flowbite-react';
// import { Button } from '../components/Button';
// import { FaTimes, FaTrash } from 'react-icons/fa';
// export function DeleteModal({ show, onConfirm, onCancel }: any): JSX.Element {
//   return (<Modal show={show} size="md" popup={true} onClose={onCancel}>
//     <Modal.Header />
//     <Modal.Body>
//       <div className="text-center">
//         <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-white">
//           Are you sure you want to delete this page?
//         </h3>
//         <div className="flex justify-center gap-4">
//           <Button color="text-white bg-red-700 hover:bg-red-800" onClick={onConfirm}>
//             <FaTrash className='mr-2' /> Delete
//           </Button>
//           <Button color="text-white bg-primary-700 hover:bg-primary-800" onClick={onCancel}>
//             <FaTimes className='mr-2' /> Cancel
//           </Button>
//         </div>
//       </div>
//     </Modal.Body>
//   </Modal>
//   );
// }

export function DeleteModal({ show, onConfirm, onCancel }: any) {
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onCancel}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center dark:text-white">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-secondary-100 dark:bg-secondary-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Delete Page
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm">
                      Are you sure you want to delete this page?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-200 mr-2 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={onConfirm}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 mr-2 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
