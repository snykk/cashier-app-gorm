package api

import (
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
)

func (api *API) showImage(w http.ResponseWriter, r *http.Request) {
	imageName := r.URL.Query().Get("image-name")

	dir, err := os.Getwd()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fileLocation := filepath.Join(dir, "template/assets/images", imageName)

	fileBytes, err := ioutil.ReadFile(fileLocation) // membaca file image menjadi bytes
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("File not found"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Write(fileBytes)
}
