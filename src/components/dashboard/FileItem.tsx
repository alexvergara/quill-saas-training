import type { File } from '@/server/db/schema';

import FilesTableItem from './FilesTableItem';
import FilesListItem from './FilesListItem';

const FileItem = ({ mode, index, className, file, deleteUserFile, currentlyDeletingFile }: { mode: string; index: number; className?: string; file?: File; deleteUserFile?: (file: File) => void; currentlyDeletingFile?: number | null }) => {
  // TODO: Use Context ?
  const handleDeleteFile = () => {
    if (deleteUserFile && file) deleteUserFile(file);
  };

  // TODO: Paginate ?

  if (!file) {
    if (mode === 'list') return FilesTableItem.Skeleton;

    return <li className={className}>{FilesListItem.Skeleton}</li>;
  }

  if (mode === 'list') {
    return (
      <>
        {index === 0 && FilesTableItem.Header}
        <FilesTableItem file={file} deleteUserFile={handleDeleteFile} currentlyDeletingFile={currentlyDeletingFile} />
      </>
    );
  }

  return <FilesListItem file={file} deleteUserFile={handleDeleteFile} currentlyDeletingFile={currentlyDeletingFile} className={className} />;
};

export default FileItem;
