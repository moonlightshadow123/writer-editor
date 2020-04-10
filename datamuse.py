import requests, json
ADDR = "https://api.datamuse.com/words?"

class DataMuse:
	def __init__(self):
		pass

	def syn(self, word):
		addr = ADDR + "rel_syn=" +word
		response = requests.get(addr)
		data = json.loads(response.content)
		word_list = []
		for each in data:
			word_list.append(each['word'])
		print(word_list)
		return word_list

if __name__ == "__main__":
	dm = DataMuse()
	dm.syn("beast")

