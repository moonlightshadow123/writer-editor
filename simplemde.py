from PyQt5.QtWidgets import QApplication
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QObject,  QUrl,  QRect, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
import os, json
from datamuse import DataMuse

class WebView(QWebEngineView):
    def __init__(self, *args, clef="treble", **kwargs):
        super(WebView, self).__init__(*args, **kwargs)

        file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "simplemde.html"))
        local_url = QUrl.fromLocalFile(file_path)
        self.clef = clef
        self.load(local_url)
        self.dm = DataMuse()
        # web channel
        self.webchannel = QWebChannel(self)
        self.page().setWebChannel(self.webchannel)
        self.webchannel.registerObject('MyChannel', self)
        # self.loadFinished.connect(self.newStaff);
    @pyqtSlot(str,result=str)
    def syn(self, word):
        # print ("Some string: %s" % some_string)
        print(word)
        word_list = self.dm.syn(word)
        print(word_list)
        data = json.dumps(word_list)
        print(data)
        return data

if __name__ == "__main__":
    app = QApplication([])
    view = WebView()
    view.show()
    app.exec_()
