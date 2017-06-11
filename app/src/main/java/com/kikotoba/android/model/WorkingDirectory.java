package com.kikotoba.android.model;

import android.content.Context;
import android.util.Log;

import com.kikotoba.android.model.entity.Article;
import com.kikotoba.android.util.D;
import com.kikotoba.android.util.FileUtil;
import com.kikotoba.android.util.IOUtil;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;

/**
 * Created by raix on 2017/04/16.
 */

public class WorkingDirectory {

    /**
     * @param article
     * @param relativePath "../../"とか。ルートなら空文字""
     * @return
     */
    public static String getAudioPath(Article article, String relativePath) {
        return String.format("%s/audio/%s/%s_%d.mp3",
                relativePath,
                article.getId(),
                article.getLanguage(),
                article.getAudioVersion());
    }

    private static WorkingDirectory instance = new WorkingDirectory();
    public static WorkingDirectory getInstance() {
        return instance;
    }

    public boolean hasAudioDownloaded(Context context, Article article) {
        File audioFile = createAudioDestinationFile(context, article);
        audioFile.list();
        return audioFile.exists();
    }

    public File createAudioCache() throws IOException {
        return File.createTempFile("audio", "mp3");
    }

    public File createAudioDestinationFile(Context context, Article article) {
        File toDir = FileUtil.createPrivateExternalDir(context, "");
        return new File(toDir, getAudioPath(article, ""));
    }

    public void deleteAudio(Context context) {
        File toDir = FileUtil.createPrivateExternalDir(context, "");
        File audioDir = new File(toDir, "/audio");
        try {
            for (File f : audioDir.listFiles()) {
                FileUtils.deleteDirectory(f);
            }
            D.d.d(toDir.getAbsolutePath());
            D.d.d(toDir.getPath());
            D.dir(toDir);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void createWorkingDirectory(Context context) {
        File sd = IOUtil.getPrivateExternalDir(context, "");
        FileUtil fileUtil = new FileUtil(context);
        try {
            fileUtil.copyFiles(null, "", sd);
        } catch (IOException e) {
            e.printStackTrace();
        }

        D.d.d(sd.getAbsolutePath());
        D.d.d(sd.getPath());
        D.dir(sd);
        Log.v("####### end ", "###########################");
    }

}
