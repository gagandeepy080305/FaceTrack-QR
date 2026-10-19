import { useEffect, useMemo } from "react";
import { CameraIcon, UploadIcon } from "./Icons";

export default function FileDrop({ id, file, onChange, title, hint, capture }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  return (
    <>
      <label htmlFor={id} className={`ft-drop ${file ? "ft-drop--filled" : ""}`}>
        {preview ? (
          <img src={preview} alt="Selected" className="ft-drop__preview" />
        ) : (
          <span className="ft-drop__icon">
            {capture ? <CameraIcon size={26} /> : <UploadIcon size={26} />}
          </span>
        )}
        <span className="ft-drop__text">
          <strong>{file ? "Change photo" : title}</strong>
          <small>{file ? file.name : hint}</small>
        </span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture={capture}
        className="ft-sr-only"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
    </>
  );
}
