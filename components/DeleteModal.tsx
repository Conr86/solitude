import React from 'react';
import { Modal } from '@alfiejones/flowbite-react';
import { Button } from '../components/Button';
import { FaTimes, FaTrash } from 'react-icons/fa';


export function DeleteModal({ show, onConfirm, onCancel }: any): JSX.Element {
  return (<Modal show={show} size="md" popup={true} onClose={onCancel}>
    <Modal.Header />
    <Modal.Body>
      <div className="text-center">
        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-white">
          Are you sure you want to delete this page?
        </h3>
        <div className="flex justify-center gap-4">
          <Button color="dark:text-white bg-red-700 hover:bg-red-800" onClick={onConfirm}>
            <FaTrash className='mr-2' /> Delete
          </Button>
          <Button color="dark:text-white bg-primary-700 hover:bg-primary-800" onClick={onCancel}>
            <FaTimes className='mr-2' /> Cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  );
}
