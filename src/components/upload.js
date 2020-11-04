import React, { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"

export default ({ onChange }) => {
    const [files, setFiles] = useState([]);
    const onDrop = useCallback(
        (acceptedFiles) => {
            onChange(acceptedFiles)
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        [onChange]
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section style={{ display: 'flex' }}>
            <div style={{ height: '50px', borderRadius: '10px', padding: '10px', border: '1px dashed #ececec' }} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
            </div>
            <div style={{ display: 'flex', padding: '10px' }}>
                {files.map(file => (
                    <div style={{ width: 'fit-content', margin: 'auto' }} key={file.name}>
                        <div >
                            <img
                                src={file.preview}
                                alt='preview'
                                style={{ width: '100px' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
