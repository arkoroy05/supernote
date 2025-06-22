'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ModalDialog({
    title,
    content,
    onConfirm,
    onCancel,
    open,
    setOpen
}: {
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className="text-xl font-semibold text-gray-900">
                                    {title}
                                </Dialog.Title>

                                <div className="mt-4 max-h-60 overflow-y-auto text-sm text-gray-700">
                                    <ReactMarkdown >
                                        {content}
                                    </ReactMarkdown>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onCancel();
                                            setOpen(false);
                                        }}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onConfirm();
                                            setOpen(false);
                                        }}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
