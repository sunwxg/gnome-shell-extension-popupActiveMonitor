
install:
	rm -rf ~/.local/share/gnome-shell/extensions/popupActiveMonitor@sun.wxg@gmail.com
	mkdir -pv ~/.local/share/gnome-shell/extensions
	cp -r popupActiveMonitor@sun.wxg@gmail.com ~/.local/share/gnome-shell/extensions/

submit:
	cd popupActiveMonitor@sun.wxg@gmail.com/ && zip -r ~/popupActiveMonitor.zip *


