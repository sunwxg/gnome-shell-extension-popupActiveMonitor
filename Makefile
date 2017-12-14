
submit:
	cd popupActiveMonitor@sun.wxg@gmail.com/ && zip -r ~/popupActiveMonitor.zip *

install:
	rm -rf ~/.local/share/gnome-shell/extensions/popupActiveMonitor@sun.wxg@gmail.com
	mkdir ~/.local/share/gnome-shell/extensions
	cp -r popupActiveMonitor@sun.wxg@gmail.com ~/.local/share/gnome-shell/extensions/

