package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var fonts = map[string]struct {
	name   string
	online [][2]string
}{
	"/impact": {name: "Impact", online: [][2]string{
		{"https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.eot?#iefix", "embedded-opentype"},
		{"https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.woff2", "woff2"},
		{"https://db.onlinewebfonts.com/t/6330ddc0d8e61db73c521dbe6288743b.ttf", "truetype"},
	}},
	"/inter": {name: "Inter", online: [][2]string{
		{"https://fonts.gstatic.com/s/inter/v3/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff", "woff"},
	}},
	"/ubuntu": {name: "Ubuntu", online: [][2]string{
		{"https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgoKfw72nU6AFw.woff2", "woff2"},
	}},
	"/unifont": {name: "Unifont", online: [][2]string{
		{"http://unifoundry.com/pub/unifont/unifont-14.0.02/font-builds/unifont-14.0.02.ttf", "truetype"},
	}},
	"/minecraft": {name: "Minecraft", online: [][2]string{
		{"https://db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.woff", "woff"},
	}},
	"/woodcut": {name: "Woodcut", online: [][2]string{
		{"https://zerm.eu/Woodcut.ttf", "truetype"},
	}},
}

func getCss(url string) string {
	font := fonts[url]
	css := "@font-face {"
	css += "font-family: '" + font.name + "'; "
	css += "src: local('" + font.name + "')"
	for _, file := range font.online {
		css += ", url(" + file[0] + ") format('" + file[1] + "')"
	}
	css += "; }"
	return css
}

func main() {
	var requests = prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "hanna_requests",
		Help: "Requests",
	}, []string{"path"})
	prometheus.MustRegister(requests)

	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Got a %s request from %s: %s (%s)",
			r.Proto, r.RemoteAddr, r.URL, r.Host)
		requests.WithLabelValues(r.URL.Path).Inc()
		if r.URL.Path == "/" {
			w.Header().Add("content-type", "text/css")
			for k := range fonts {
				fmt.Fprintln(w, getCss(k))
			}
		} else if _, ok := fonts[r.URL.Path]; ok {
			w.Header().Add("content-type", "text/css")
			fmt.Fprint(w, getCss(r.URL.Path))
		} else {
			w.WriteHeader(404)
			fmt.Fprint(w, "Font \""+r.URL.Path+"\" not found.")
		}
	})

	http.ListenAndServe(":8042", nil)
}
