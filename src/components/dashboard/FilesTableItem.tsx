import type { File } from '@/server/db/schema';

import Link from 'next/link';
import { CheckCircleIcon, CircleIcon, FileTextIcon, Loader2Icon, TrashIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FilesTableItem = ({ file, deleteUserFile, currentlyDeletingFile }: { file: File; deleteUserFile: (file: File) => void; currentlyDeletingFile?: number | null }) => {
  const fileSize = (parseFloat('0' + file.size) / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <tr className="items-center h-8 bg-gray-100 hover:bg-gray-20 dark:bg-gray-900/30 dark:hover:bg-gray-900">
      <td colSpan={1} className="pl-2">
        <Link href={`/dashboard/${file.publicId}`} className="flex overflow-hidden items-center space-x-2">
          <FileTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="truncate w-full">{file.name}</span>
        </Link>
      </td>
      {/* <td className="w-24 text-center text-sm">{file.retry}</td> */}
      {/* <td className="w-24 text-center text-sm">{file.uploadStatus}</td> */}
      <td className="w-24 text-right text-sm">{fileSize}</td>
      <td className="w-24 text-right text-sm">{file.pages}</td>
      <td className="w-24 text-center text-sm">{file.score}</td>
      <td className="w-24">{file.isReadable ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td>
      {/* <td className="w-24">{file.isBlacklisted ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td> */}
      <td className="w-24">{file.isProcessed ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td>
      {/* <td className="w-24">{file.isPublic ? <CheckCircleIcon className="m-auto h-4 w-4" /> : <CircleIcon className="m-auto h-4 -w-4 text-gray-200 dark:text-slate-700" />}</td> */}
      <td className="text-center w-8 px-1">{currentlyDeletingFile === file.id ? <Loader2Icon className="m-auto w-4 h-4 animate-spin" /> : <TrashIcon className="m-auto text-red-500 h-4 w-4 cursor-pointer" onClick={() => deleteUserFile(file)} />}</td>
    </tr>
  );
};

FilesTableItem.Header = (
  <tr>
    <th className="text-sm">File</th>
    {/* <th className="text-center text-sm">Retry</th> */}
    {/* <th className="text-center text-sm">Status</th> */}
    <th className="text-right text-sm">Size</th>
    <th className="text-right text-sm">Pages</th>
    <th className="text-center text-sm">Score</th>
    <th className="text-center text-sm">Readable</th>
    {/* <th className="text-center text-sm">Blacklisted</th> */}
    <th className="text-center text-sm">Processed</th>
    {/* <th className="text-center text-sm">Public</th> */}
    <th className="text-center text-sm"></th>
  </tr>
);

FilesTableItem.Skeleton = (
  <tr>
    <td>
      <Skeleton className="w-full h-6 rounded bg-gray-50 dark:bg-gray-900" />
    </td>
  </tr>
);

FilesTableItem.DisplayName = 'FilesTableItem';

export default FilesTableItem;
