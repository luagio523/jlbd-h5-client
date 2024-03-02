-- local project_dir = '../'

-- package.path = string.format("%s;%s?.lua;%s?/init.lua",  
-- 			package.path , project_dir, project_dir) -- 添加路径 '..\\..\\'

-- require("src/packages/utils/ioutil")
-- require("src/cocos/cocos2d/functions")
-- require("src/cocos/cocos2d/bitExtend")
local normal2json =  require("./lib/json")

local pretty2json =  require("./lib/pretty2json")

local config_path ="./temp/"
local tar_config_path = "./temp/"


function fwrite(path, content)
	local file = io.open(path, "w+")
	if file then
		if file:write(content) == nil then return false end
		io.close(file)
		return true
	else
		return false
	end
end


local filter_name ={
	-- ["game_config"] =1,
	-- ["daily_task"]  =1,
	-- ["global"] = 1,
	-- ["gunLevelMapConfig"] = 1
}





-- pretty 表示是否格式化
local function gen_config(pretty)
	local encode2json = pretty and pretty2json or normal2json

	
	local i, t,n, popen = 0, {},{}, io.popen
	for filename in popen('dir "'..config_path..'" /b '):lines() do
		   if string.find(filename,".lua")   then
			   i = i + 1
			   t[i] = filename
			   local fname = string.gsub(filename,".lua","")
			   if not filter_name[fname] then
				   local tb = require(config_path..fname)
				   local jt = encode2json(tb)
				   fwrite(tar_config_path..fname..".json",jt)
   
				   print(filename)
			   end
		   end
   end
end


-- gen_config(false)

gen_config(false) -- pretty 表示是否格式化