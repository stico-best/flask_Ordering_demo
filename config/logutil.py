import logging
import os


class Logger:
    def __init__(self, log_file_path, log_level):
        try:
            os.path.exists(log_file_path)
        except Exception:
            print('日志文件路径错误, 请重新检查')

        self.logger = logging.getLogger('logutil')
        self.formatter = None
        self.log_level = None
        self.log_file_path = log_file_path
        self.file_handler = logging.FileHandler(filename=self.log_file_path)
        self.set_log_level(log_level)

    def set_log_level(self, log_level):
        level_dict = {
            'DEBUG': logging.DEBUG,
            'INFO': logging.INFO,
            'WARNING': logging.WARNING,
            'ERROR': logging.ERROR,
            'CRITICAL': logging.CRITICAL
        }
        try:
            if log_level in level_dict.keys():
                self.log_level = level_dict[log_level]
                self.file_handler.setLevel(self.log_level)
                self.logger.setLevel(self.log_level)
        except ValueError:
            raise f'设置的日志格式Level有误'

    def set_log(self):
        self.formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
        )
        self.file_handler.setFormatter(self.formatter)
        self.logger.addHandler(self.file_handler)
        return self.logger

    def debug(self, message):
        self.logger = self.set_log()
        return self.logger.debug(message)

    def info(self, message):
        self.logger = self.set_log()
        return self.logger.info(message)

    def warning(self, message):
        self.logger = self.set_log()
        return self.logger.warning(message)

    def error(self, message):
        self.logger = self.set_log()
        return self.logger.error(message)

    def critical(self, message):
        self.logger = self.set_log()
        return self.logger.critical(message)