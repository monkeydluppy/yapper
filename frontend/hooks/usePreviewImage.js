

import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImage = () => {
    const [imageUrl, setImageUrl] = useState(null)
    const customToast = useShowToast()

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result)
                // console.log(reader.result)
            }

            reader.readAsDataURL(file)

        }
        else {
            if (file) {
                customToast("Invalid File Type", "Please Select Image File Type", "error")
                setImageUrl(null)
            }
        }
    }
    return { handleImageChange, imageUrl, setImageUrl }
}

export default usePreviewImage

